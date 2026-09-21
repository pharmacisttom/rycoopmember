"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

type SweetAlertNoticeProps = {
  type: "error" | "success" | "warning" | "info";
  title: string;
  text?: string;
};

export function SweetAlertNotice({ type, title, text }: SweetAlertNoticeProps) {
  useEffect(() => {
    void Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#08213d"
    });
  }, [text, title, type]);

  return null;
}
