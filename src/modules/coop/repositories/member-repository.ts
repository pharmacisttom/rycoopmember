import type { MemberDashboard } from "@/modules/coop/types/member";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";

export type MemberRepository = {
  findDashboardByMember(params: { organizationId: string; memberId: string; phpSessionId?: string }): Promise<MemberDashboard | null>;
};

export class CentralMemberRepository implements MemberRepository {
  async findDashboardByMember({ memberId, phpSessionId }: { organizationId: string; memberId: string; phpSessionId?: string }): Promise<MemberDashboard | null> {
    return legacyApiClient.getMemberDashboard(memberId, phpSessionId);
  }
}

// Default production repository connects to the central system
export const defaultMemberRepository: MemberRepository = new CentralMemberRepository();

// Test fixture mock repository (used only in isolated unit tests)
const thb = (amount: string) => ({ amount, currency: "THB" as const });

const demoDashboardFixture: MemberDashboard = {
  profile: {
    id: "member_demo_001",
    organizationId: "org_rayong_health_coop",
    userId: "user_demo_member",
    memberNo: "RYS-001245",
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    avatarUrl: undefined,
    citizenIdMasked: "1-XXXX-XXXXX-45-6",
    birthDate: "1982-02-14",
    gender: "MALE",
    memberType: "สามัญ",
    joinDate: "2012-05-01",
    status: "ACTIVE",
    organizationName: "สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด",
    department: "โรงพยาบาลระยอง",
    position: "นักวิชาการสาธารณสุข",
    salary: thb("48500.00"),
    phone: "08X-XXX-4821",
    email: "somchai@example.com",
    address: "อำเภอเมืองระยอง จังหวัดระยอง",
    bankAccountMasked: "XXX-X-XXXXX-X",
    beneficiary: "นางสาวสมใจ ใจดี",
    emergencyContact: "089-XXX-9912"
  },
  summary: {
    shareCapital: thb("0.00"),
    totalDeposits: thb("0.00"),
    outstandingLoans: thb("0.00"),
    monthlyInstallment: thb("0.00"),
    guaranteeExposure: thb("0.00"),
    latestDividend: thb("18250.00"),
    latestPatronageRefund: thb("6420.00"),
    welfareAvailable: thb("0.00")
  },
  shareTransactions: [],
  deposits: [],
  loans: [],
  guarantees: [],
  dividends: [
    {
      id: "div_2568",
      fiscalYear: 2568,
      averageShares: thb("0.00"),
      dividendRate: "5.05%",
      dividendAmount: thb("18250.00"),
      eligibleLoanInterest: thb("0.00"),
      patronageRate: "5.00%",
      patronageRefund: thb("6420.00"),
      totalNet: thb("24670.00"),
      announcedAt: "2025-03-20",
      paymentStatus: "PAID",
      paymentChannel: "โอนเข้าบัญชี",
      receivingAccountMasked: "XXX-X-XXXXX-X"
    }
  ],
  welfare: [],
  requests: [],
  announcements: [],
  assetBeneficiaryAssignments: [],
  unreadMessages: 0
};

export const mockMemberRepository: MemberRepository = {
  async findDashboardByMember({ organizationId, memberId }) {
    if (demoDashboardFixture.profile.organizationId !== organizationId || demoDashboardFixture.profile.id !== memberId) {
      return null;
    }
    return demoDashboardFixture;
  }
};
