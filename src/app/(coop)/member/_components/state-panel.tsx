export function StatePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <h1 className="text-xl font-bold text-navy-900">{title}</h1>
      <div className="mt-4">{children}</div>
    </section>
  );
}
