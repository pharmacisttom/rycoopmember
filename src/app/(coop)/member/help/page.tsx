import { StatePanel } from "../_components/state-panel";

export default function HelpPage() {
  return (
    <StatePanel title="Helpdesk">
      <form className="grid gap-3">
        <input className="rounded-md border border-slate-300 p-3" placeholder="หัวข้อปัญหา" />
        <select className="rounded-md border border-slate-300 p-3" defaultValue="NORMAL">
          <option value="LOW">LOW</option>
          <option value="NORMAL">NORMAL</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
        <textarea className="min-h-32 rounded-md border border-slate-300 p-3" placeholder="รายละเอียด" />
        <button className="rounded-md bg-navy-900 px-4 py-3 font-bold text-white">เปิด Ticket</button>
      </form>
    </StatePanel>
  );
}
