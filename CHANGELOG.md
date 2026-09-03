# Changelog

All notable changes to `@all3cn/dsh-better-sidebar-n23` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `tests/` unit tests (invariant companion + manifest/package consistency) run
  with the Node.js built-in test runner — zero toolchain.
- `ci` workflow: runs the test suite, validates the registry packager syntax,
  and checks package manifest consistency on every push and pull request.
- `CONTRIBUTING.md`, `SECURITY.md`, and `THIRD-PARTY-NOTICES.md`.

### Documented

- The intentional `src/`-ahead / `lib/`-ahead split-track state and the
  src/lib sync policy are now written down in `UPSTREAM.md`.

## [0.1.0] - 2026-08-31

### Added

- First fork release of upstream `dsh-better-sidebar@0.12.3` under the
  `@all3cn` scope as `@all3cn/dsh-better-sidebar-n23`.
- Complete DSH workbench: explorer / editors / previews / terminal / git /
  browser / tasks with side + bottom split panes.
- VSCode-like shell refactor: full-width 48px header, activity rail, global
  controls.
- Service-first API: `ctx.betterSidebar` with `registerTab` /
  `registerFileViewer`.
- `dsh.bundle.patch` (`cordis.patch.yml`) for one-command install + mount.

### Fixed

- Panel drag no longer writes CSS variables per frame; the central
  conversation reflows once on pointer-release commit.
- Lazy chunk loading against newer DSH kernels that removed the
  `window.__DSH_MODULES__` page global.
