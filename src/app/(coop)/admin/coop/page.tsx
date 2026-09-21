const metrics = [
  ["Total Members", "12,842"],
  ["Open Requests", "38"],
  ["Open Chats", "11"],
  ["Open Tickets", "24"],
  ["SLA Compliance", "96.4%"],
  ["Satisfaction", "4.7/5"]
];

export default function AdminDashboardPage() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
