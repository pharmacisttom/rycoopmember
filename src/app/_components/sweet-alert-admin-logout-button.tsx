"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function SweetAlertAdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const confirmation = await Swal.fire({
      title: "ออกจากระบบแอดมิน?",
      text: "ยืนยันการออกจากระบบหลังบ้าน",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#08213d"
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    Swal.fire({
      title: "กำลังออกจากระบบ",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    await fetch("/api/v1/coop/admin/auth/logout", {
      method: "POST",
      redirect: "manual"
    });

    await Swal.fire({
      title: "ออกจากระบบแล้ว",
      icon: "success",
      timer: 900,
      showConfirmButton: false
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="mt-3 w-full rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">
      ออกจากระบบ
    </button>
  );
}
