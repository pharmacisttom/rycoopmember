#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]] || { echo "Run with sudo" >&2; exit 1; }
[[ $(/usr/bin/node -p 'process.versions.node.split(".")[0]') == 24 ]] || { echo "Install Node.js 24 LTS at /usr/bin/node first" >&2; exit 1; }
command -v npm >/dev/null
command -v systemctl >/dev/null
id rycoopmember >/dev/null 2>&1 || useradd --system --create-home --home-dir /var/lib/rycoopmember --shell /usr/sbin/nologin rycoopmember
install -d -o rycoopmember -g rycoopmember -m 0750 /var/www/rycoopmember /var/www/rycoopmember/releases
install -d -o rycoopmember -g rycoopmember -m 0700 /var/lib/rycoopmember/sessions
here=$(cd -- "$(dirname -- "$(readlink -f -- "$0")")" && pwd)
if [[ ! -f /etc/rycoopmember.env ]]; then
    umask 0077
    /usr/bin/node - "$here/production.env.example" <<'NODE'
const fs=require('node:fs'),crypto=require('node:crypto');
const text=fs.readFileSync(process.argv[2],'utf8').replace('REPLACE_WITH_RANDOM_SECRET',crypto.randomBytes(48).toString('base64'));
fs.writeFileSync('/etc/rycoopmember.env',text,{flag:'wx',mode:0o640});
NODE
fi
chown root:rycoopmember /etc/rycoopmember.env
chmod 0640 /etc/rycoopmember.env
/usr/bin/node "$here/../scripts/production-env.mjs" /etc/rycoopmember.env
install -m 0644 "$here/rycoopmember.service" /etc/systemd/system/rycoopmember.service
systemctl daemon-reload
systemctl enable rycoopmember.service
echo "Service installed. Review /etc/rycoopmember.env, deploy backend first, then run deploy.sh."
