# Azora VPS deployment

The four website repositories deploy independently to `152.239.116.142`:

| Repository | Domain | Document root |
| --- | --- | --- |
| `azora-lang-website` | `azoralang.org` | `/var/www/azoralang.org/html` |
| `azora-lang-docs-website` | `docs.azoralang.org` | `/var/www/docs.azoralang.org/html` |
| `azora-lang-code-website` | `code.azoralang.org` | `/var/www/code.azoralang.org/html` |
| `azora-lang-book-website` | `book.azoralang.org` | `/var/www/book.azoralang.org/html` |

## One-time VPS setup

Clone `azora-lang-website` on the VPS, then run:

```bash
sudo ./deploy/bootstrap-vps.sh <deploy-user> <certificate-email>
```

The script creates isolated document roots, installs the nginx configuration,
and obtains one Let's Encrypt certificate for the main domain and all website
subdomains. Every listed DNS record must resolve to `152.239.116.142` before
requesting the certificate.

## GitHub Actions secrets

Expose this organization or repository secret to all four repositories:

- `AZORA_SSH_PRIVATE_KEY`: private SSH key for the dedicated `azora-deploy`
  account.

The workflow follows the proven `merea-website` direct-rsync deployment model,
but it does not reuse Merea's root credential. It connects as the unprivileged
`azora-deploy` user on the verified SSH port `22` and fails before deployment
with a clear error when the Azora-specific key is missing.

Each push to `main` builds with `npm ci` and synchronizes `dist/` to that
site's document root. `rsync --delete` removes stale hashed assets without
affecting the other websites.
