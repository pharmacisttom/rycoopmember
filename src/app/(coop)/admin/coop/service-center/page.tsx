const queues = [
  ["Unassigned Chats", "7"],
  ["Waiting Member", "12"],
  ["Waiting Internal", "9"],
  ["Overdue Tickets", "3"],
  ["Today's Requests", "21"],
  ["Urgent Issues", "2"]
];

export default function ServiceCenterPage() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-bold text-navy-900">Admin Service Center</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {queues.map(([label, value]) => (
          <button key={label} className="rounded-md border border-slate-200 p-4 text-left hover:border-coop-cyan">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
