import type { MemberDashboard } from "@/modules/coop/types/member";

export type MemberRepository = {
  findDashboardByMember(params: { organizationId: string; memberId: string }): Promise<MemberDashboard | null>;
};

const thb = (amount: string) => ({ amount, currency: "THB" as const });

const dashboard: MemberDashboard = {
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
    shareCapital: thb("385000.00"),
    totalDeposits: thb("124050.25"),
    outstandingLoans: thb("820000.00"),
    monthlyInstallment: thb("12800.00"),
    guaranteeExposure: thb("350000.00"),
    latestDividend: thb("18250.00"),
    latestPatronageRefund: thb("6420.00"),
    welfareAvailable: thb("30000.00")
  },
  shareTransactions: [
    { id: "share_tx_1", postedAt: "2026-09-01", description: "ส่งหุ้นรายเดือน", shareQty: 100, amount: thb("1000.00") },
    { id: "share_tx_2", postedAt: "2026-08-01", description: "ส่งหุ้นรายเดือน", shareQty: 100, amount: thb("1000.00") }
  ],
  deposits: [
    { id: "dep_1", accountType: "ออมทรัพย์", accountNoMasked: "XXX-X-49281-X", balance: thb("98050.25"), interestAccrued: thb("420.15") },
    { id: "dep_2", accountType: "ออมทรัพย์พิเศษ", accountNoMasked: "XXX-X-77192-X", balance: thb("26000.00"), interestAccrued: thb("188.40") }
  ],
  loans: [
    {
      id: "loan_1",
      loanType: "เงินกู้สามัญ",
      contractNo: "LN-2568-00452",
      originalPrincipal: thb("1200000.00"),
      outstandingPrincipal: thb("820000.00"),
      interestRate: "5.75%",
      installmentAmount: thb("12800.00"),
      currentInstallment: 19,
      totalInstallments: 120,
      principalPaid: thb("380000.00"),
      interestPaid: thb("48250.00"),
      nextPaymentDate: "2026-10-05",
      status: "ACTIVE"
    }
  ],
  guarantees: [
    {
      id: "g_1",
      direction: "GIVEN",
      personName: "นางสาวมณี สุขใจ",
      loanContractNo: "LN-2567-00991",
      guaranteeAmount: thb("350000.00"),
      outstandingLoan: thb("290000.00"),
      status: "ACTIVE",
      startDate: "2024-06-15"
    },
    {
      id: "g_2",
      direction: "RECEIVED",
      personName: "นายวิชัย แสงดี",
      loanContractNo: "LN-2568-00452",
      guaranteeAmount: thb("600000.00"),
      outstandingLoan: thb("820000.00"),
      status: "ACTIVE",
      startDate: "2025-01-10"
    }
  ],
  dividends: [
    {
      id: "div_2569",
      fiscalYear: 2569,
      averageShares: thb("361000.00"),
      dividendRate: "5.05%",
      dividendAmount: thb("18250.00"),
      eligibleLoanInterest: thb("128400.00"),
      patronageRate: "5.00%",
      patronageRefund: thb("6420.00"),
      totalNet: thb("24670.00"),
      announcedAt: "2026-03-20",
      paymentStatus: "PAID",
      paymentChannel: "โอนเข้าบัญชี",
      receivingAccountMasked: "XXX-X-49281-X",
      transactionReference: "TRN-DIV-2569-001245"
    }
  ],
  welfare: [
    {
      id: "wf_1",
      type: "ค่ารักษาพยาบาล",
      entitlement: thb("30000.00"),
      condition: "ตามระเบียบสวัสดิการสมาชิกประจำปี",
      requiredDocuments: ["ใบรับรองแพทย์", "ใบเสร็จรับเงิน"],
      receivedAmount: thb("0.00")
    }
  ],
  requests: [
    { id: "req_1", number: "REQ-2569-000118", subject: "ขอหนังสือรับรองเงินปันผล", status: "IN_PROGRESS", updatedAt: "2026-09-20T09:30:00+07:00" }
  ],
  announcements: [
    { id: "ann_1", category: "ข่าวปันผล", title: "ประกาศกำหนดจ่ายเงินปันผลและเงินเฉลี่ยคืน", publishedAt: "2026-09-18", pinned: true },
    { id: "ann_2", category: "สวัสดิการ", title: "เปิดรับคำขอสวัสดิการการศึกษาบุตร", publishedAt: "2026-09-10", pinned: false }
  ],
  assetBeneficiaryAssignments: [
    {
      id: "beneficiary_assignment_1",
      requestNumber: "BEN-2569-000045",
      beneficiaryFullName: "นางสาวสมใจ ใจดี",
      relationship: "บุตร",
      citizenIdMasked: "1-XXXX-XXXXX-88-1",
      phone: "08X-XXX-2244",
      address: "อำเภอเมืองระยอง จังหวัดระยอง",
      witnessName: "นายวิชัย แสงดี",
      status: "READY_TO_SUBMIT",
      generatedAt: "2026-09-21T10:00:00+07:00",
      allocations: [
        { assetType: "SHARES", assetLabel: "หุ้นสะสม", percent: 50, note: "มอบตามสัดส่วนที่ระบุ" },
        { assetType: "DEPOSITS", assetLabel: "บัญชีเงินฝากทุกประเภท", percent: 30 },
        { assetType: "DIVIDEND", assetLabel: "เงินปันผลและเงินเฉลี่ยคืนค้างรับ", percent: 20 }
      ]
    }
  ],
  unreadMessages: 2
};

export const mockMemberRepository: MemberRepository = {
  async findDashboardByMember({ organizationId, memberId }) {
    if (dashboard.profile.organizationId !== organizationId || dashboard.profile.id !== memberId) {
      return null;
    }

    return dashboard;
  }
};
