import { NextResponse } from "next/server";
import { getSessionSecret } from "@/core/auth/session";
import { accessSync,constants } from "node:fs";
export const dynamic="force-dynamic";
export async function GET() {
 try {
  getSessionSecret();
  if(!process.env.SESSION_STATE_DIR || !process.env.PHP_BACKEND_URL) throw Error("Missing configuration");
  accessSync(process.env.SESSION_STATE_DIR,constants.W_OK);
  const base=process.env.PHP_BACKEND_URL.replace(/\/$/,"");
  for(const endpoint of ["/api/auth/me","/api/member/requests"]) {
   const response=await fetch(base+endpoint,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(5000)});
   const body=await response.json();
   if(response.status!==401 || body.success!==false)throw Error("Backend contract not ready");
  }
  return NextResponse.json({status:"ready"},{headers:{"Cache-Control":"no-store"}});
 } catch {return NextResponse.json({status:"not_ready"},{status:503,headers:{"Cache-Control":"no-store"}});}
}
