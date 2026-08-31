# Release process — @all3cn/dsh-better-sidebar

This fork publishes the npm package `@all3cn/dsh-better-sidebar`. The
repository ships the prebuilt `lib/` directly (no tsc/tsdown toolchain is
carried; `src/` and `lib/` are synchronized by hand — see
[UPSTREAM.md](../UPSTREAM.md)), so releases never build in CI.

## What gets published

Defined by `files` in `package.json`:

- `lib/` — compiled host/client bundles + `.d.ts` types (the runtime)
- `src/` — TypeScript sources (kept in sync with `lib/`, shipped for
  attribution and downstream forks)
- `cordis.patch.yml` — the `dsh.bundle.patch` layer: `dsh plugin add`
  reconciles it into `dsh.profile.bundles` automatically; the plugin row id
  stays the stable `better-sidebar`
- `dsh-plugin.json` — plugin manifest (see below)
- `scripts/install.sh` / `scripts/install.ps1` — one-shot install helpers
- `scripts/package-registry.mjs` — build-free registry packager
- README / README_EN / LICENSE / UPSTREAM.md

## Pre-publish checklist (local, no npm credentials needed)

```sh
node --check scripts/package-registry.mjs        # syntax
npm run package:registry -- --dry-run           # validate files allowlist + manifest
npm pack --ignore-scripts                       # audit exact tarball contents
tar -tzf all3cn-dsh-better-sidebar-0.1.0.tgz    # spot-check entries
```

The registry packager additionally writes `dist/dsh-plugin.json` (manifest
with the expanded shipped-file list) and `dist/<tarball>` when run without
`--dry-run`.

## Manifest: `dsh-plugin.json`

A fork-local manifest (name, id, version, upstream attribution, validated DSH
version, entry points, install command). It is NOT read by the `dsh plugin`
CLI — that channel uses the `dsh` field inside `package.json`
(`dsh.bundle.patch`, `dsh.client.inject`, `dsh.client.platform`), which is
the verified official convention. `dsh-plugin.json` exists so registry /
marketplace tooling has one self-describing artifact; treat it as advisory
metadata until a DSH plugin registry defines an official schema.

## npm publication

Publication uses **npm Trusted Publishing** (OIDC): no npm token is stored in
GitHub or anywhere else.

One-time setup (repo admin, in npmjs.com):

1. Create / claim the `@all3cn` scope (public).
2. For package `@all3cn/dsh-better-sidebar`, configure a trusted publisher:
   - registry: `npmjs.com`
   - repository: `All3nCN/dsh-better-sidebar`
   - workflow filename: `.github/workflows/release.yml`
   - environment: `release`

Cut a release:

```sh
# 1. bump "version" in package.json AND dsh-plugin.json (keep them equal)
# 2. update README release notes
# 3. commit, then:
git tag v0.1.0
git push origin main --tags
```

The `release` workflow (only on tags matching `v*`) runs `npm publish
--provenance --access public` with `id-token: write` (OIDC) and the
`release` environment. Provenance attestations require the trusted publisher
to be configured first — the workflow fails closed (no fallback token).

## After publishing

Install channel:

```sh
dsh plugin --profile web add @all3cn/dsh-better-sidebar
```

Marketplace listing: no unauthenticated submission route for a DSH plugin
registry/marketplace is currently known; if one is documented, submit the
`dist/dsh-plugin.json` manifest + repo URL there.
