import { mockMemberRepository } from "@/modules/coop/repositories/member-repository";

const organizationId = "org_rayong_health_coop";
const memberId = "member_demo_001";

export class CoopWebReadonlyService {
  async getPublicSummary() {
    const dashboard = await mockMemberRepository.findDashboardByMember({ organizationId, memberId });

    if (!dashboard) {
      throw new Error("WEB_READONLY_DATA_NOT_FOUND");
    }

    return {
      cooperativeName: dashboard.profile.organizationName,
      serviceName: "ระบบสมาชิกสหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด",
      availableServices: [
        "ตรวจสอบข้อมูลสมาชิก",
        "หุ้นและเงินฝาก",
        "เงินกู้และค้ำประกัน",
        "เงินปันผลและเงินเฉลี่ยคืน",
        "คำร้องออนไลน์",
        "เอกสารและ Statement",
        "Chat และ Helpdesk"
      ],
      latestAnnouncementCount: dashboard.announcements.length
    };
  }

  async getAnnouncements() {
    const dashboard = await mockMemberRepository.findDashboardByMember({ organizationId, memberId });

    if (!dashboard) {
      throw new Error("WEB_READONLY_DATA_NOT_FOUND");
    }

    return dashboard.announcements.map((announcement) => ({
      id: announcement.id,
      category: announcement.category,
      title: announcement.title,
      publishedAt: announcement.publishedAt,
      pinned: announcement.pinned
    }));
  }

  async getServiceCatalog() {
    return [
      { key: "member-profile", title: "ข้อมูลสมาชิก", href: "/member/profile" },
      { key: "shares", title: "หุ้นสะสม", href: "/member/shares" },
      { key: "deposits", title: "เงินฝาก", href: "/member/deposits" },
      { key: "loans", title: "เงินกู้", href: "/member/loans" },
      { key: "beneficiaries", title: "ทายาทและการมอบหมายสินทรัพย์", href: "/member/beneficiaries" },
      { key: "statements", title: "Statement", href: "/member/statements" },
      { key: "helpdesk", title: "Helpdesk", href: "/member/help" }
    ];
  }
}
