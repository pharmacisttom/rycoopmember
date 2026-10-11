#!/usr/bin/env bash
set -Eeuo pipefail
[[ $EUID -eq 0 ]] || { echo "Run with sudo" >&2; exit 1; }
root=/var/www/rycoopmember
exec 9>/run/lock/rycoopmember-deploy.lock
flock -n 9 || { echo "A deployment is running" >&2; exit 1; }
target=$(readlink -f "$root/previous")
current=$(readlink -f "$root/current")
[[ "$target" == "$root/releases/"* && -d "$target" && -f "$target/.next/BUILD_ID" ]] || { echo "No valid previous release" >&2; exit 1; }
ln -s "$target" "$root/.current-rollback"
mv -Tf "$root/.current-rollback" "$root/current"
systemctl restart rycoopmember.service
healthy=0
for i in {1..15}; do if curl -fsS --max-time 12 http://127.0.0.1:3100/api/ready >/dev/null; then healthy=1; break; fi; sleep 2; done
if [[ $healthy != 1 ]]; then
    ln -s "$current" "$root/.current-rollback-restore"; mv -Tf "$root/.current-rollback-restore" "$root/current"; systemctl restart rycoopmember.service
    echo "Rollback failed; original release restored" >&2; exit 1
fi
ln -sfn "$current" "$root/previous"
echo "Rollback completed. Database and private session state were preserved."
