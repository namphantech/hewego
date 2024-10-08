import React from 'react';
import { useGetPlatformFeesQuery } from '@/api/fee-platform/queries';
import { useGetPriceFeedQuery } from '@/api/price-feed/queries';
import { useIssueBondStore } from '@/store/useIssueBondStore';
import { FCC } from '@/types';
import { convertMaturityDateToISO, parseUnits } from '@/utils/common';
import { DATE_FORMAT, TOKEN_UNIT } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { format } from 'date-fns';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { formatUnits } from 'viem';

import { FormWrapper } from '@/components/ui/form';

import { IssueBondFormType, issueBondSchema } from '../types/schema';

const IssueBondFormWrapper: FCC = ({ children }) => {
  const onOpenModal = useIssueBondStore.use.onOpenModal();

  const form = useForm<IssueBondFormType>({
    resolver: zodResolver(issueBondSchema),
    mode: 'onTouched',
  });

  const [durationBond, borrowInterestRate, loanToken, collateralToken, loanAmount] = form.watch([
    'durationBond',
    'borrowInterestRate',
    'loanToken',
    'collateralToken',
    'loanAmount',
  ]);

  const [borrowInterestRateDebounced] = useDebouncedValue(borrowInterestRate, 300);
  const [loanAmountDebounced] = useDebouncedValue(loanAmount, 300);

  const { data } = useGetPlatformFeesQuery();

  const platformFee = React.useMemo(() => {
    if (!data) return 0;

    return Number(data?.data?.platformFee);
  }, [data]);

  React.useEffect(() => {
    if (borrowInterestRateDebounced) {
      form.setValue('lenderInterestRate', borrowInterestRateDebounced - Number(platformFee));
    }
  }, [borrowInterestRateDebounced, form, platformFee]);

  React.useEffect(() => {
    form.setValue(
      'issuanceDate',
      format(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10), DATE_FORMAT.DD_MM_YYYY)
    );
  }, [form]);

  React.useEffect(() => {
    if (!durationBond) return;

    const type = durationBond.includes('month') ? 'month' : 'week';
    const dayCount = type === 'month' ? 1 : 7;
    const newDate = convertMaturityDateToISO(Number(durationBond.split(' ')[0]) * dayCount, type);

    form.setValue('maturityDate', format(new Date(newDate).toISOString().slice(0, 10), DATE_FORMAT.DD_MM_YYYY));
  }, [durationBond, form]);

  React.useEffect(() => {
    if (!loanAmountDebounced) return;

    form.setValue('volumeBond', Math.round(loanAmountDebounced / 100));
  }, [form, loanAmountDebounced]);

  React.useEffect(() => {
    if (!loanAmountDebounced || !durationBond || !borrowInterestRate) return;

    const duration = Number(durationBond.split(' ')[0]);
    const loanAmount = Number(loanAmountDebounced);
    const interestRate = Number(borrowInterestRate) / 100;
    const loanAmountWithInterest = (loanAmount * interestRate * duration) / 52;
    const totalValue = loanAmountWithInterest;

    form.setValue('totalRepaymentAmount', String(Number(totalValue).toFixed(2)));
  }, [durationBond, form, borrowInterestRate, loanAmountDebounced]);

  const { data: priceFeedData } = useGetPriceFeedQuery({
    variables: {
      loanAmount: String(parseUnits(loanAmountDebounced, Number(TOKEN_UNIT))),
      collateralToken: collateralToken,
      loanToken: loanToken,
    },
    enabled: !!(loanAmountDebounced && collateralToken && loanToken),
  });

  React.useEffect(() => {
    if (!priceFeedData) return;

    form.setValue(
      'minimumCollateralAmount',
      String(Number(formatUnits(BigInt(priceFeedData?.data?.collateralPrice || 0), Number(TOKEN_UNIT))).toFixed(2))
    );
  }, [form, priceFeedData]);

  const handleSubmit: SubmitHandler<IssueBondFormType> = () => {
    if (!loanToken || !collateralToken) {
      toast.error('Please select both loan token and collateral token');

      return;
    }

    onOpenModal();
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit} className="flex flex-col gap-3">
      {children}
    </FormWrapper>
  );
};

export default IssueBondFormWrapper;
