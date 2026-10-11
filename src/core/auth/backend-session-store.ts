import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
// Share this directory across Node workers. No secrets are stored in plaintext.
function location(id: string) {const dir=resolve(process.env.SESSION_STATE_DIR || ".session-state"); mkdirSync(dir,{recursive:true,mode:0o700});return join(dir,createHash("sha256").update(id).digest("hex")+".json");}
function key() {const secret=process.env.TOMVIS_SESSION_SECRET;if(!secret || (process.env.NODE_ENV === "production" && secret.length < 32)) throw new Error("SESSION_SECRET_REQUIRED");return createHash("sha256").update(secret).digest();}
export function rememberBackendSession(oldId: string,newId: string) {
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key(),iv);
  const content=Buffer.concat([cipher.update(newId,"utf8"),cipher.final()]);
  writeFileSync(location(oldId),JSON.stringify({expires:Date.now()+8*3600000,iv:iv.toString("base64"),tag:cipher.getAuthTag().toString("base64"),content:content.toString("base64")}),{mode:0o600});
}
export function resolveBackendSession(id: string): string {
  for(let i=0;i<32;i++) {const file=location(id);if(!existsSync(file)) return id;
    const data=JSON.parse(readFileSync(file,"utf8"));if(data.expires<=Date.now()) return id;
    const decipher=createDecipheriv("aes-256-gcm",key(),Buffer.from(data.iv,"base64"));decipher.setAuthTag(Buffer.from(data.tag,"base64"));
    id=Buffer.concat([decipher.update(Buffer.from(data.content,"base64")),decipher.final()]).toString("utf8");
  } throw new Error("SESSION_ROTATION_CHAIN_INVALID");
}
