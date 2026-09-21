"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import Swal from "sweetalert2";

type SweetAlertFormProps = {
  action: string;
  children: ReactNode;
  className?: string;
  confirmTitle?: string;
  confirmText?: string;
  successTitle: string;
  successText?: string;
  errorTitle?: string;
  redirectTo?: string;
  encType?: "multipart/form-data" | "application/x-www-form-urlencoded";
};

export function SweetAlertForm({
  action,
  children,
  className,
  confirmTitle,
  confirmText,
  successTitle,
  successText,
  errorTitle = "ดำเนินการไม่สำเร็จ",
  redirectTo,
  encType = "multipart/form-data"
}: SweetAlertFormProps) {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (confirmTitle) {
      const confirmation = await Swal.fire({
        title: confirmTitle,
        text: confirmText,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#08213d"
      });

      if (!confirmation.isConfirmed) {
        return;
      }
    }

    Swal.fire({
      title: "กำลังดำเนินการ",
      text: "กรุณารอสักครู่",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const body = new FormData(form);
      const response = await fetch(action, {
        method: "POST",
        body,
        headers: {
          "x-sweetalert-form": "1"
        },
        redirect: "manual"
      });

      if (!response.ok) {
        let message = "กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง";
        try {
          const payload = await response.json();
          message = payload?.error?.message ?? message;
        } catch {
          // Keep the generic Thai error for non-JSON responses.
        }

        throw new Error(message);
      }

      await Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#08213d"
      });

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (error) {
      await Swal.fire({
        title: errorTitle,
        text: error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#08213d"
      });
    }
  }

  return (
    <form action={action} method="post" encType={encType} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
