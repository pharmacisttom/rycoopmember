import { StatePanel } from "../_components/state-panel";

export default function SecurityPage() {
  return (
    <StatePanel title="ความปลอดภัย">
      <div className="grid gap-3 md:grid-cols-3">
        {["2FA", "Recovery Code", "Trusted Device"].map((item) => (
          <div key={item} className="rounded-md border border-slate-200 p-4 font-bold">{item}</div>
        ))}
      </div>
    </StatePanel>
  );
}
