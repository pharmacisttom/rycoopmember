import { StatePanel } from "../_components/state-panel";

export default function ChatPage() {
  return (
    <StatePanel title="Chat กับสหกรณ์">
      <div className="space-y-3">
        <div className="max-w-[80%] rounded-md bg-slate-100 p-3">สวัสดีครับ ต้องการสอบถามเรื่องใด</div>
        <div className="ml-auto max-w-[80%] rounded-md bg-coop-blue p-3 text-white">สอบถามสถานะคำร้องขอหนังสือรับรองครับ</div>
        <textarea className="min-h-28 w-full rounded-md border border-slate-300 p-3" placeholder="พิมพ์ข้อความ" />
        <button className="rounded-md bg-navy-900 px-4 py-3 font-bold text-white">ส่งข้อความ</button>
      </div>
    </StatePanel>
  );
}
