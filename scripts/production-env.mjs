import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export function parseEnvironment(text) {
 const values={};
 for(const raw of text.split(/\r?\n/)) {
  const line=raw.trim();if(!line || line.startsWith('#'))continue;
  const match=line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
  if(!match)throw Error('Invalid environment file syntax');
  let value=match[2].trim();
  if(value.startsWith('"'))value=JSON.parse(value);
  else if(value.startsWith("'")){if(!value.endsWith("'"))throw Error('Invalid quotation');value=value.slice(1,-1);}
  if(typeof value!=='string'||/[\r\n\0]/.test(value))throw Error('Invalid environment value');
  if(Object.hasOwn(values,match[1]))throw Error('Duplicate environment setting');
  values[match[1]]=value;
 } return values;
}
export function validateEnvironment(env) {
 if(env.NODE_ENV!=='production')throw Error('NODE_ENV must be production');
 const secret=env.TOMVIS_SESSION_SECRET || '';
 if(secret.length<32 || /^(REPLACE|generate-|change-|rycoopmember-dev)/i.test(secret))throw Error('Set a unique random session secret (at least 32 characters)');
 for(const key of ['PHP_BACKEND_URL','NEXT_PUBLIC_APP_URL']) {
  const url=new URL(env[key] || '');
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error(key+' must be an origin without credentials or path');
  if(url.protocol!=='https:' && !(key==='PHP_BACKEND_URL' && ['localhost','127.0.0.1'].includes(url.hostname) && url.protocol==='http:'))throw Error(key+' requires HTTPS');
 }
 if(!/^[A-Za-z0-9_-]{1,80}$/.test(env.PHP_SESSION_COOKIE_NAME || ''))throw Error('Invalid PHP_SESSION_COOKIE_NAME');
 if(!/^\/var\/lib\/rycoopmember\/[A-Za-z0-9/_-]+$/.test(env.SESSION_STATE_DIR || '') || env.SESSION_STATE_DIR.includes('..'))throw Error('Use a private state directory under /var/lib/rycoopmember/');
 return env;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
 try {
  const [, , file,command,...args]=process.argv;
  const env=validateEnvironment(parseEnvironment(fs.readFileSync(file,'utf8')));
  if(!command){console.log('Production environment validated (secrets not displayed)');}
  else {if(!['npm','node'].includes(command))throw Error('Only npm or node commands are supported');
   const result=spawnSync(command,args,{stdio:'inherit',env:{...process.env,...env}});if(result.error)throw result.error;process.exitCode=result.status ?? 1;}
 } catch(error) {console.error(error.message);process.exitCode=1;}
}
