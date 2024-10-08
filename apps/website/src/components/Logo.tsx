import React from 'react';
import Link from 'next/link';
import { ROUTE } from '@/types';

import { LogoSvg } from './layouts/MainLayout/components/LogoSvg';

interface Props {}

const Logo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Props>((props, ref) => {
  return (
    <div ref={ref} {...props}>
      <Link href={ROUTE.HOME} className="text-3xl text-black font-semibold">
        <LogoSvg />
      </Link>
    </div>
  );
});

Logo.displayName = 'Logo';

export default Logo;
