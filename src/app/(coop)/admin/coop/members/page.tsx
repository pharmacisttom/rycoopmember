export default function AdminMembersPage() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-bold text-navy-900">สมาชิก</h1>
      <input className="mt-4 w-full rounded-md border border-slate-300 p-3" placeholder="ค้นหาด้วยเลขสมาชิก ชื่อ โทรศัพท์ อีเมล หรือ Citizen ID hash" />
      <div className="mt-4 rounded-md bg-slate-50 p-3 font-semibold">RYS-001245 · สมชาย ใจดี · ACTIVE</div>
    </section>
  );
}
