import { StatePanel } from "../_components/state-panel";

export default function DocumentsPage() {
  const docs = ["หนังสือรับรองสมาชิก", "หนังสือรับรองหุ้น", "หนังสือรับรองเงินกู้", "หนังสือรับรองเงินปันผล", "Statement"];
  return (
    <StatePanel title="เอกสารของฉัน">
      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc} className="rounded-md border border-slate-200 p-3 font-bold text-slate-800">{doc}</div>
        ))}
      </div>
    </StatePanel>
  );
}
