export type Money = {
  amount: string;
  currency: "THB";
};

export type CoopMemberProfile = {
  id: string;
  organizationId: string;
  userId: string | null;
  memberNo: string;
  prefix: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  citizenIdMasked: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  memberType: string;
  joinDate: string;
  status: "ACTIVE" | "SUSPENDED" | "RESIGNED";
  organizationName: string;
  department: string;
  position: string;
  salary: Money;
  phone: string;
  email: string;
  address: string;
  bankAccountMasked: string;
  beneficiary: string;
  emergencyContact: string;
};

export type FinancialSummary = {
  shareCapital: Money;
  totalDeposits: Money;
  outstandingLoans: Money;
  monthlyInstallment: Money;
  guaranteeExposure: Money;
  latestDividend: Money;
  latestPatronageRefund: Money;
  welfareAvailable: Money;
};

export type ShareTransaction = {
  id: string;
  postedAt: string;
  description: string;
  shareQty: number;
  amount: Money;
};

export type DepositAccount = {
  id: string;
  accountType: string;
  accountNoMasked: string;
  balance: Money;
  interestAccrued: Money;
};

export type Loan = {
  id: string;
  loanType: string;
  contractNo: string;
  originalPrincipal: Money;
  outstandingPrincipal: Money;
  interestRate: string;
  installmentAmount: Money;
  currentInstallment: number;
  totalInstallments: number;
  principalPaid: Money;
  interestPaid: Money;
  nextPaymentDate: string;
  status: "ACTIVE" | "CLOSED" | "OVERDUE";
};

export type Guarantee = {
  id: string;
  direction: "GIVEN" | "RECEIVED";
  personName: string;
  loanContractNo: string;
  guaranteeAmount: Money;
  outstandingLoan: Money;
  status: "ACTIVE" | "RELEASED";
  startDate: string;
};

export type DividendRecord = {
  id: string;
  fiscalYear: number;
  averageShares: Money;
  dividendRate: string;
  dividendAmount: Money;
  eligibleLoanInterest: Money;
  patronageRate: string;
  patronageRefund: Money;
  totalNet: Money;
  announcedAt: string;
  paymentStatus: "APPROVED" | "PAID" | "PENDING_APPROVAL";
  paymentChannel: string;
  receivingAccountMasked: string;
  transactionReference?: string;
};

export type WelfareBenefit = {
  id: string;
  type: string;
  entitlement: Money;
  condition: string;
  requiredDocuments: string[];
  receivedAmount: Money;
};

export type ServiceRequestSummary = {
  id: string;
  number: string;
  subject: string;
  status: "SUBMITTED" | "ASSIGNED" | "IN_PROGRESS" | "WAITING_MEMBER" | "RESOLVED" | "CLOSED";
  updatedAt: string;
};

export type Announcement = {
  id: string;
  category: string;
  title: string;
  publishedAt: string;
  pinned: boolean;
};

export type MemberDashboard = {
  profile: CoopMemberProfile;
  summary: FinancialSummary;
  shareTransactions: ShareTransaction[];
  deposits: DepositAccount[];
  loans: Loan[];
  guarantees: Guarantee[];
  dividends: DividendRecord[];
  welfare: WelfareBenefit[];
  requests: ServiceRequestSummary[];
  announcements: Announcement[];
  unreadMessages: number;
};
