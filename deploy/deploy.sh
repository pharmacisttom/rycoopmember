#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]] || { echo "Run with sudo" >&2; exit 1; }
root=/var/www/rycoopmember
repo=https://github.com/pharmacisttom/rycoopmember.git
ref="${1:-codex/member-portal-integration}"
[[ "$ref" != -* && "$ref" =~ ^[A-Za-z0-9_./-]+$ ]] || { echo "Invalid Git ref" >&2; exit 1; }
here=$(cd -- "$(dirname -- "$(readlink -f -- "$0")")" && pwd)
exec 9>/run/lock/rycoopmember-deploy.lock
flock -n 9 || { echo "Another deployment is running" >&2; exit 1; }
/usr/bin/node "$here/../scripts/production-env.mjs" /etc/rycoopmember.env
if [[ ! -d "$root/repository.git" ]]; then git clone --mirror "$repo" "$root/repository.git"; fi
[[ $(git --git-dir="$root/repository.git" remote get-url origin) == "$repo" ]] || { echo "Unexpected repository origin" >&2; exit 1; }
git --git-dir="$root/repository.git" fetch --prune origin
commit=$(git --git-dir="$root/repository.git" rev-parse --verify "${ref}^{commit}")
release="$root/releases/$(date -u +%Y%m%dT%H%M%SZ)-${commit:0:12}"
mkdir "$release"
git --git-dir="$root/repository.git" archive "$commit" | tar -x -C "$release"
chown -R rycoopmember:rycoopmember "$release"
cd "$release"
runuser -u rycoopmember -- /usr/bin/node scripts/production-env.mjs /etc/rycoopmember.env npm ci --include=dev
runuser -u rycoopmember -- env NODE_ENV=test SESSION_STATE_DIR="$release/.test-session-state" npm test -- --no-cache
runuser -u rycoopmember -- /usr/bin/node scripts/production-env.mjs /etc/rycoopmember.env npm run build
# Keep the complete dependency tree: this also permits diagnosing and rebuilding releases.
previous=$(readlink -f "$root/current" 2>/dev/null || true)
started=0
cleanup() { if [[ $started == 1 ]]; then systemctl stop rycoopmember-preflight.service >/dev/null 2>&1 || true; fi; }
trap cleanup EXIT
if ss -lnt | awk '{print $4}' | grep -qE ':3199$'; then echo "Preflight port 3199 is occupied" >&2; exit 1; fi
systemd-run --unit=rycoopmember-preflight --property=User=rycoopmember --property=Group=rycoopmember --property="WorkingDirectory=$release" --property=EnvironmentFile=/etc/rycoopmember.env --property=RuntimeMaxSec=120 /usr/bin/node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3199
started=1
ready=0
for i in {1..30}; do if curl -fsS --max-time 12 http://127.0.0.1:3199/api/ready >/dev/null; then ready=1; break; fi; sleep 2; done
[[ $ready == 1 ]] || { echo "Preflight failed; current release was not changed" >&2; exit 1; }
cleanup; started=0
ln -s "$release" "$root/.current-next"
mv -Tf "$root/.current-next" "$root/current"
systemctl restart rycoopmember.service
healthy=0
for i in {1..15}; do if curl -fsS --max-time 12 http://127.0.0.1:3100/api/ready >/dev/null; then healthy=1; break; fi; sleep 2; done
if [[ $healthy != 1 ]]; then
    if [[ "$previous" == "$root/releases/"* && -d "$previous" ]]; then
        ln -s "$previous" "$root/.current-restore"; mv -Tf "$root/.current-restore" "$root/current"; systemctl restart rycoopmember.service
        echo "Deployment failed; previous release restored" >&2
    else systemctl stop rycoopmember.service; echo "First deployment failed; service stopped" >&2; fi
    exit 1
fi
if [[ "$previous" == "$root/releases/"* && -d "$previous" ]]; then ln -sfn "$previous" "$root/previous"; fi
printf 'Deployed member portal commit %s\n' "$commit"
