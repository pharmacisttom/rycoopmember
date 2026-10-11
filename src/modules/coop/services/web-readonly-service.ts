export class CoopWebReadonlyService {
 async getPublicSummary() {return {cooperativeName:"สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด",serviceName:"ระบบสมาชิกสหกรณ์",availableServices:["ข้อมูลสมาชิก","เงินปันผลและเงินเฉลี่ยคืน","คำขอแก้ไขข้อมูล"]};}
 async getAnnouncements() {return [];}
 async getServiceCatalog() {return [{key:"member-profile",title:"ข้อมูลสมาชิก",href:"/member/profile"},{key:"dividend",title:"เงินปันผล",href:"/member/dividend"},{key:"requests",title:"คำขอแก้ไขข้อมูล",href:"/member/requests"}];}
}
