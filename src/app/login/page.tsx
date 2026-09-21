import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fb] px-4 py-8">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-md bg-navy-950 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-cyan-100">ระบบสมาชิกสหกรณ์</p>
          <h1 className="mt-2 text-3xl font-bold">เข้าสู่ระบบสมาชิก</h1>
          <div className="mt-6 grid gap-3 text-sm text-slate-100">
            <p>ใช้เลขสมาชิกเป็นชื่อผู้ใช้</p>
            <p>ใช้เลขบัตรประชาชนเป็นรหัสผ่าน</p>
            <p>ใช้เบอร์โทรปัจจุบันเป็นรหัสยืนยัน</p>
          </div>
          <div className="mt-6 rounded-md bg-white/10 p-4 text-sm text-cyan-50">
            ชุดทดสอบ scaffold: เลขสมาชิก RYS-001245, เลขบัตรประชาชน 1234567890456, เบอร์โทร 0899994821
          </div>
        </div>

        <form action="/api/v1/coop/auth/login" method="post" className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-navy-900">Member Login</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 font-semibold text-slate-700">
              เลขสมาชิก
              <input name="memberNo" autoComplete="username" className="rounded-md border border-slate-300 p-3" placeholder="RYS-001245" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              รหัสผ่านเลขบัตรประชาชน
              <input name="citizenId" type="password" autoComplete="current-password" className="rounded-md border border-slate-300 p-3" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              รหัสยืนยันเบอร์โทรปัจจุบัน
              <input name="phoneVerificationCode" inputMode="tel" className="rounded-md border border-slate-300 p-3" placeholder="0899994821" />
            </label>
          </div>
          <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            ในระบบจริงเลขบัตรประชาชนและเบอร์โทรต้องตรวจด้วยข้อมูลที่เข้ารหัส/แฮชแล้ว และควรบังคับเปลี่ยนรหัสผ่านหลังเข้าสู่ระบบครั้งแรก
          </p>
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white">
            <LogIn className="h-5 w-5" aria-hidden />
            เข้าสู่ระบบ
          </button>
        </form>
      </section>
    </main>
  );
}
