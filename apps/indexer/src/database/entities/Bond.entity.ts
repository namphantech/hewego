import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
} from "typeorm";
import { BondStatusEnum } from "../../shared/enums";

@Entity("bonds")
@Unique(["bondId", "contractAddress"])
export class Bond {
  @PrimaryColumn({ name: "bond_id", type: "int" })
  public bondId: number;

  @Column({
    name: "name",
    type: "varchar",
    nullable: true,
  })
  name: string;

  @Column({ name: "loan_term", type: "int", nullable: true })
  loanTerm: number;

  @Column({
    name: "loan_amount",
    type: "bigint",
    nullable: true,
  })
  public loanAmount: number;

  @Column({ name: "total_sold", type: "int", nullable: false, default: 0 })
  totalSold: number;

  @Column({ name: "loan_token", type: "varchar", nullable: true })
  public loanToken: string;

  @Column({
    name: "collateral_amount",
    type: "bigint",
    nullable: true,
  })
  public collateralAmount: number;

  @Column({ name: "collateral_token", type: "varchar", nullable: true })
  public collateralToken: string;

  @Column({ name: "volume_bond", type: "bigint", nullable: false })
  public volumeBond: number;

  @Column({
    name: "borrower_interest_rate",
    type: "decimal",
    precision: 40,
    scale: 8,
    nullable: true,
  })
  borrowerInterestRate: number;

  @Column({
    name: "lender_interest_rate",
    type: "decimal",
    precision: 40,
    scale: 8,
    nullable: true,
  })
  lenderInterestRate: number;

  @Column({ name: "issuance_date", type: "bigint", nullable: true })
  public issuanceDate: number;

  @Column({ name: "maturity_date", type: "bigint", nullable: true })
  public maturityDate: number;

  @Column({
    name: "borrower_address",
    type: "varchar",
    length: 80,
    nullable: true,
  })
  borrowerAddress: string;

  @PrimaryColumn({
    type: "varchar",
    name: "contract_address",
  })
  contractAddress: string;

  @Column({ type: "varchar", name: "transaction_hash", nullable: true })
  transactionHash: string;

  @Column({ type: "varchar", name: "onchain_status", nullable: true })
  onchainStatus: string;

  @Column({
    type: "varchar",
    name: "status",
    default: BondStatusEnum.PENDING_ISSUANCE,
  })
  status: string;

  @Column({ name: "claimed_loan_at", type: "timestamp", nullable: true })
  claimedLoanAt: Date;

  @Column({ name: "repaid_at", type: "timestamp", nullable: true })
  repaidAt: Date;

  @Column({ name: "repaid_amount", type: "bigint", nullable: true })
  repaidAmount: number;

  @Column({ name: "grace_period_ends_at", type: "timestamp", nullable: true })
  gracePeriodEndsAt: Date;

  @Column({ name: "liquidated_at", type: "timestamp", nullable: true })
  liquidatedAt: Date;

  @Column({ name: 'liquidated_amount', type: 'bigint', nullable: true })
  liquidatedAmount: number;


  @Column({ name: "canceled_at", type: "timestamp", nullable: true })
  canceledAt: Date;

  @Column({ name: "block_number", type: "bigint", nullable: true })
  blockNumber: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
