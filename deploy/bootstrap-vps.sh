#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
    echo "Run this script as root or with sudo." >&2
    exit 1
fi

deploy_user=${1:-}
certificate_email=${2:-}

if [[ -z ${deploy_user} ]]; then
    echo "Usage: sudo ./deploy/bootstrap-vps.sh <deploy-user> [certificate-email]" >&2
    exit 1
fi

if ! id "${deploy_user}" >/dev/null 2>&1; then
    echo "Deploy user '${deploy_user}' does not exist." >&2
    exit 1
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
nginx_source="${script_dir}/nginx/azoralang.org.conf"
nginx_target=/etc/nginx/sites-available/azoralang.org
products_nginx_source="${script_dir}/nginx/azora-products.conf"
products_nginx_target=/etc/nginx/sites-available/azora-products

apt-get update
apt-get install --yes nginx rsync certbot python3-certbot-nginx

for domain in \
    azoralang.org \
    docs.azoralang.org \
    code.azoralang.org \
    book.azoralang.org \
    azoralabs.org \
    azoraengine.org \
    azorastudio.org
do
    install -d -m 2775 -o "${deploy_user}" -g www-data "/var/www/${domain}/html"
done

install -m 0644 "${nginx_source}" "${nginx_target}"
install -m 0644 "${products_nginx_source}" "${products_nginx_target}"
ln -sfn "${nginx_target}" /etc/nginx/sites-enabled/azoralang.org
ln -sfn "${products_nginx_target}" /etc/nginx/sites-enabled/azora-products

nginx -t
systemctl reload nginx

if [[ -n ${certificate_email} ]]; then
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "${certificate_email}" \
        -d azoralang.org \
        -d www.azoralang.org \
        -d docs.azoralang.org \
        -d code.azoralang.org \
        -d book.azoralang.org
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "${certificate_email}" \
        -d azoralabs.org \
        -d www.azoralabs.org
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "${certificate_email}" \
        -d azoraengine.org \
        -d www.azoraengine.org
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email "${certificate_email}" \
        -d azorastudio.org \
        -d www.azorastudio.org
else
    echo "Nginx is ready. Re-run with a certificate email after every DNS name points to this VPS."
fi
