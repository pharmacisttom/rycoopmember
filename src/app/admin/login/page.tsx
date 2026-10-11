import { ShieldCheck } from "lucide-react";
import { SweetAlertForm } from "@/app/_components/sweet-alert-form";
import { SweetAlertNotice } from "@/app/_components/sweet-alert-notice";

export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const hasLoginError = searchParams?.error === "invalid";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-md bg-navy-950 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-cyan-100">Cooperative Command Center</p>
          <h1 className="mt-2 text-3xl font-bold">เข้าสู่ระบบหลังบ้าน</h1>
          <div className="mt-6 grid gap-3 text-sm text-slate-100">
            <p>สำหรับเจ้าหน้าที่และผู้ดูแลระบบสหกรณ์</p>
            <p>ใช้บัญชีแอดมินที่ได้รับมอบหมายเท่านั้น</p>
            <p>ทุกการเข้าสู่ระบบจะถูกบันทึก Audit</p>
          </div>
        </div>

        {hasLoginError ? (
          <SweetAlertNotice type="error" title="เข้าสู่ระบบแอดมินไม่สำเร็จ" text="กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน" />
        ) : null}

        <SweetAlertForm
          action="/api/v1/coop/admin/auth/login"
          className="rounded-md border border-slate-200 bg-white p-5 shadow-soft"
          encType="multipart/form-data"
          successTitle="เข้าสู่ระบบแอดมินสำเร็จ"
          successText="กำลังพาไปหน้า Dashboard หลังบ้าน"
          errorTitle="เข้าสู่ระบบแอดมินไม่สำเร็จ"
          redirectTo="/admin/coop"
        >
          <h2 className="text-xl font-bold text-navy-900">Admin Login</h2>
          {hasLoginError ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน
            </p>
          ) : null}
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2 font-semibold text-slate-700">
              ชื่อผู้ใช้
              <input name="username" autoComplete="username" required className="rounded-md border border-slate-300 p-3" placeholder="ระบุชื่อผู้ใช้เจ้าหน้าที่" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              รหัสผ่าน
              <input name="password" type="password" autoComplete="current-password" required className="rounded-md border border-slate-300 p-3" />
            </label>
          </div>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-500">
            ระบบตรวจสอบสิทธิ์เจ้าหน้าที่กับฐานข้อมูลกลางสหกรณ์ หากเข้าสู่ระบบไม่สำเร็จเกิน 5 ครั้ง จะถูกจำกัดเวลาชั่วคราว
          </p>
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white hover:bg-navy-950 transition-colors">
            <ShieldCheck className="h-5 w-5" aria-hidden />
            เข้าสู่ระบบหลังบ้าน
          </button>
        </SweetAlertForm>
      </section>
    </main>
  );
}
