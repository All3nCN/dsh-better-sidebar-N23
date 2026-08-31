# @all3cn/dsh-better-sidebar

A service-first sidebar framework plus a complete out-of-the-box workbench for
DSH. This package is a community fork of the open-source plugin
[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) (MIT),
published independently under the `@all3cn` scope; see
[UPSTREAM.md](./UPSTREAM.md) for attribution.

English | [中文](./README.md)

## Features

- **File workbench**: explorer (lazy directory tree, symlink-aware) +
  CodeMirror editor; inline previews for images / Markdown / HTML / PDF /
  Office documents
- **Real terminal**: xterm.js + node-pty real shell with reconnect replay;
  optional `terminal_*` model tools
- **Git panel**: real diffs + VSCode-style diff tabs, history, stage / commit
  / revert from the context menu
- **Embedded browser**: multi-tab web views with back / forward / reload,
  sandboxed iframe content
- **Background tasks**: subagent topology and background jobs (exit codes,
  live output, force kill)
- **Dual workspace**: side panel + bottom panel; drag tabs to split / merge
  panes across both
- **Shell refactor**: full-width 48px header, VSCode-style activity rail, and
  global controls — an IDE layout where the conversation and the workbench
  coexist
- **Service API**: open to every plugin via `ctx.betterSidebar` — register
  sidebar pages and file viewers with `registerTab` / `registerFileViewer`;
  built-in tabs and third-party plugins use the same registration interface
- **Session isolation**: layout / tabs / panes persisted per conversation
  session; UI follows the DSH language (zh / en)

## Compatibility

Validated against DSH (DeepSeek Harness) `0.1.1-rc.2`; peer dependencies are
declared as `@deepseek-ai/* >= 0.1.0-rc.6 < 0.2.0`. Requires Node.js >= 20.

## Install

Prerequisite: a working DSH installation (`dsh web` runs).

```sh
dsh plugin --profile web add @all3cn/dsh-better-sidebar
```

The package declares a `dsh.bundle.patch`
([cordis.patch.yml](./cordis.patch.yml)); the CLI bundle reconciliation adds
it to the profile bundle stack automatically — no profile file edits. If the
profile still carries an old manual mount line for `dsh-better-sidebar`
(upstream or a local fork copy), remove it first to avoid double-mounting.
Uninstall: `dsh plugin --profile web remove @all3cn/dsh-better-sidebar`.

A one-shot helper script is included (handles pnpm 11 build approvals and the
minimumReleaseAge bypass):

```sh
bash scripts/install.sh                # macOS / Linux / Git Bash
powershell -File scripts/install.ps1   # Windows
```

## Integration for other plugins

```ts
// in any DSH plugin's client half
ctx.betterSidebar.registerTab({ id: "my-tab", title: "My Tab", render: ... });
ctx.betterSidebar.registerFileViewer({ pattern: "**/*.xyz", render: ... });
```

## Release notes

### 0.1.0 (first fork release)

- Based on upstream `dsh-better-sidebar@0.12.3`, republished under the
  `@all3cn` scope
- Panel drags no longer write CSS variables per frame; the central
  conversation reflows once on pointer-release commit
- Complete workbench: explorer / editors / previews / terminal / git /
  browser / tasks with side + bottom split panes
- Shell refactor: full-width 48px header, activity rail, global controls
- Compatible with the newer DSH kernel module system (lazy chunk fix),
  validated on `0.1.1-rc.2`

## Release and packaging

- npm release flow: [docs/RELEASE.md](./docs/RELEASE.md) (tag `v*` triggers
  Trusted Publishing with provenance)
- Build-free registry packaging (manifest + npm-style tarball audit):
  `npm run package:registry -- --dry-run`
- This repository tracks the prebuilt `lib/` directly; `src/` and `lib/` are
  kept in sync by hand (see [UPSTREAM.md](./UPSTREAM.md))

## License

[MIT](./LICENSE). Forked from omdsh-dev/DSH-better-sidebar (MIT); not
affiliated with DeepSeek or the upstream authors.
