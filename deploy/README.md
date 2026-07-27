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

Expose these organization or repository secrets to all four repositories:

- `VPS_USER`: SSH user that owns the four document roots.
- `VPS_SSH_KEY`: private SSH key for `VPS_USER`.

The workflows temporarily fall back to the existing `HOSTINGER_USER` and
`HOSTINGER_SSH_KEY` names so credentials can be migrated without interrupting
deployment. The old Hostinger port is intentionally ignored; the VPS uses
the verified SSH port `22`. The public VPS address is kept in the workflow
rather than stored as a secret.

Each push to `main` builds with `npm ci` and synchronizes `dist/` to that
site's document root. `rsync --delete` removes stale hashed assets without
affecting the other websites.
