"use client";
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}) {
 return <main role="alert" className="mx-auto max-w-xl p-8"><h1 className="text-xl font-bold">ไม่สามารถโหลดข้อมูลได้</h1><p className="my-4">กรุณาตรวจการเชื่อมต่อและลองใหม่ หากยังมีปัญหาให้ติดต่อสหกรณ์</p><button onClick={reset} className="rounded bg-navy-900 px-4 py-3 text-white">ลองใหม่</button><a href="/login" className="ml-4">เข้าสู่ระบบใหม่</a></main>;
}
