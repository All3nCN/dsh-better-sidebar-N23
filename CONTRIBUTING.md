# Contributing

Thanks for your interest. This is a community fork of the open-source plugin
`dsh-better-sidebar` (upstream: [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar),
MIT), published independently under the `@all3cn` scope.

## Repository layout

- `lib/` — prebuilt host/client bundles + `.d.ts` types. This is the runtime
  that ships on npm and is what `dsh` actually loads (see the `exports` and
  `dsh` entries in `package.json`).
- `src/` — TypeScript sources, tracked for attribution and for downstream
  forks.
- `cordis.patch.yml` — the `dsh.bundle.patch` layer for one-command install
  and mount.
- `dsh-plugin.json` — self-describing manifest for registry / marketplace
  tooling.
- `tests/` — zero-dependency unit tests (Node.js built-in test runner).

## src/lib synchronization

`src/` and `lib/` are kept in sync by hand; the fork checkout does not carry
the upstream tsdown/tsc build toolchain. They are currently **intentionally
split-track** (`src/` is ahead on robustness fixes, `lib/` is ahead on shell
layout). Read [UPSTREAM.md](./UPSTREAM.md) before editing either half — a
naive full rebuild can regress the shell layout.

## Testing

Tests use the Node.js built-in test runner and require no install step:

```sh
npm test
```

Add a test under `tests/` for any behavioral change that is testable without a
live DSH host.

## Releasing

See [docs/RELEASE.md](./docs/RELEASE.md). Releases are cut by tagging `v*`,
which triggers npm Trusted Publishing (OIDC, no tokens) through the `release`
environment.

## Commit and license

- Keep commit messages conventional (`feat:` / `fix:` / `docs:` / `test:` /
  `ci:` / `chore:`).
- All contributions must be compatible with the MIT license; upstream
  attribution lives in [UPSTREAM.md](./UPSTREAM.md) and
  [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
