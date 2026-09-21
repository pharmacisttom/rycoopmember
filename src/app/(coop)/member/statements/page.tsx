import { StatePanel } from "../_components/state-panel";

export default function StatementsPage() {
  const statementTypes = ["หุ้น", "เงินฝาก", "เงินกู้", "การชำระหนี้", "ดอกเบี้ย", "ปันผล", "เฉลี่ยคืน", "สวัสดิการ"];
  return (
    <StatePanel title="Statement Center">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statementTypes.map((type) => (
          <button key={type} className="min-h-20 rounded-md border border-slate-200 bg-slate-50 p-3 text-left font-bold text-slate-800 hover:border-coop-cyan">
            {type}
          </button>
        ))}
      </div>
    </StatePanel>
  );
}
