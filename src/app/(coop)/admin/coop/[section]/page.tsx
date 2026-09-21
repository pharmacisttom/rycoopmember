const names: Record<string, string> = {
  requests: "คำร้อง",
  chats: "Chat",
  tickets: "Helpdesk",
  loans: "เงินกู้",
  dividends: "ปันผล",
  welfare: "สวัสดิการ",
  documents: "เอกสาร",
  announcements: "ข่าวสาร",
  import: "Import",
  reports: "Reports",
  settings: "Settings"
};

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  const title = names[params.section] ?? "Admin";
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
      <div className="mt-4 rounded-md bg-slate-50 p-4 font-semibold text-slate-700">พื้นที่จัดการ {title} พร้อมเชื่อมต่อ workflow, audit และ permission ใน phase ถัดไป</div>
    </section>
  );
}
