# Azora VPS deployment

The seven website repositories deploy independently to `152.239.116.142`:

| Repository | Domain | Document root |
| --- | --- | --- |
| `azora-lang-website` | `azoralang.org` | `/var/www/azoralang.org/html` |
| `azora-lang-docs-website` | `docs.azoralang.org` | `/var/www/docs.azoralang.org/html` |
| `azora-lang-code-website` | `code.azoralang.org` | `/var/www/code.azoralang.org/html` |
| `azora-lang-book-website` | `book.azoralang.org` | `/var/www/book.azoralang.org/html` |
| `azora-labs-website` | `azoralabs.org` | `/var/www/azoralabs.org/html` |
| `azora-engine-website` | `azoraengine.org` | `/var/www/azoraengine.org/html` |
| `azora-studio-website` | `azorastudio.org` | `/var/www/azorastudio.org/html` |

## One-time VPS setup

Clone `azora-lang-website` on the VPS, then run:

```bash
sudo ./deploy/bootstrap-vps.sh <deploy-user> <certificate-email>
```

The script creates isolated document roots, installs the nginx configuration,
and obtains one Let's Encrypt certificate for the main domain and all website
subdomains. Every listed DNS record must resolve to `152.239.116.142` before
requesting the certificate.

## Deploy keys

Every site deploys as the unprivileged `azora-deploy` user, but each
repository has its own SSH key, stored as the repository secret
`DEPLOY_SSH_PRIVATE_KEY`. That covers these seven repositories and the other
sites on this VPS (`azora-engine-book-website`, `azora-dev-website`,
`doublegarts-eu`, `gabriel-gheorghe-eu`, `daniela-bilciu-website`). The
workflow fails before deploying, with a clear error, when the secret is
missing.

On the server, `~azora-deploy/.ssh/authorized_keys` pins each key to
[`rrsync`](https://manpages.ubuntu.com/manpages/noble/man1/rrsync.1.html)
rooted at that site's directory:

```text
command="/usr/bin/rrsync -wo /var/www/azoralang.org",restrict ssh-ed25519 AAAA… deploy@azoralang.org github:azoralabs/azora-lang-website
```

A key can therefore only upload into its own site, cannot read files back
(`-wo`), and gets no shell, pty or forwarding (`restrict`). rrsync resolves
every path relative to that directory, so the workflow uploads to `html/`
rather than to an absolute path. A site whose workflow is copied into another
repository, or edited to point elsewhere, cannot overwrite a different site.
The deploy job is also guarded with `if: github.repository == '<owner>/<repo>'`.

To add a site, generate a key pair, add the public key to `authorized_keys`
with the line above adapted to the new directory, and store the private key
in the new repository:

```bash
ssh-keygen -t ed25519 -N '' -C 'deploy@example.org github:owner/repo' -f example.org
gh secret set DEPLOY_SSH_PRIVATE_KEY -R owner/repo < example.org
```

Each push to `main` builds with `npm ci` and synchronizes `dist/` to that
site's document root. `rsync --delete` removes stale hashed assets without
affecting the other websites.
