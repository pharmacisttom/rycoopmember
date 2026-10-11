import { LogIn } from "lucide-react";
import { SweetAlertForm } from "@/app/_components/sweet-alert-form";
import { SweetAlertNotice } from "@/app/_components/sweet-alert-notice";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const hasLoginError = searchParams?.error === "invalid";

  return (
    <main className="min-h-screen bg-[#f5f8fb] px-4 py-8">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-md bg-navy-950 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-cyan-100">ระบบสมาชิกสหกรณ์</p>
          <h1 className="mt-2 text-3xl font-bold">เข้าสู่ระบบสมาชิก</h1>
          <div className="mt-6 grid gap-3 text-sm text-slate-100">
            <p>1. กรอกเลขบัตรประชาชน 13 หลัก</p>
            <p>2. กรอกรหัสผ่านบัญชีเดิมของท่าน</p>

          </div>
          <div className="mt-6 rounded-md bg-white/10 p-4 text-xs text-cyan-50">
            หมายเหตุ: บัญชีของท่านได้รับการรักษาความปลอดภัยตามมาตรฐาน หากยังไม่มีบัญชีหรือต้องการเปลี่ยนรหัสผ่าน กรุณาติดต่อฝ่ายบริการสมาชิกสหกรณ์
          </div>
        </div>

        {hasLoginError ? (
          <SweetAlertNotice
            type="error"
            title="เข้าสู่ระบบไม่สำเร็จ"
            text="กรุณาตรวจสอบเลขบัตรประชาชนและรหัสผ่าน"
          />
        ) : null}

        <SweetAlertForm
          action="/api/v1/coop/auth/login"
          className="rounded-md border border-slate-200 bg-white p-5 shadow-soft"
          encType="multipart/form-data"
          successTitle="เข้าสู่ระบบสำเร็จ"
          successText="กำลังพาไปหน้าสมาชิก"
          errorTitle="เข้าสู่ระบบไม่สำเร็จ"
          redirectTo="/member"
        >
          <h2 className="text-xl font-bold text-navy-900">Member Login</h2>
          {hasLoginError ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบเลขบัตรประชาชนและรหัสผ่าน
            </p>
          ) : null}
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 font-semibold text-slate-700">
              เลขบัตรประชาชน
              <input inputMode="numeric" minLength={13} maxLength={13} name="username" autoComplete="username" required className="rounded-md border border-slate-300 p-3" placeholder="กรอกข้อมูล" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              รหัสผ่าน
              <input name="password" type="password" autoComplete="current-password" required className="rounded-md border border-slate-300 p-3" placeholder="กรอกข้อมูล" />
            </label>
          </div>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-500">
            ระบบจะตรวจสอบบัญชีกับฐานข้อมูลกลางของสหกรณ์ หากเข้าสู่ระบบไม่สำเร็จเกิน 5 ครั้ง บัญชีจะถูกจำกัดเวลาชั่วคราวเพื่อความปลอดภัย
          </p>
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white hover:bg-navy-950 transition-colors">
            <LogIn className="h-5 w-5" aria-hidden />
            เข้าสู่ระบบ
          </button>
        </SweetAlertForm>
      </section>
    </main>
  );
}
