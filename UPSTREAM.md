# Upstream attribution

`@all3cn/dsh-better-sidebar-n23` is a fork of the open-source DSH plugin
`dsh-better-sidebar` maintained by the omdsh-dev community.

- Upstream package: `dsh-better-sidebar` (forked at version `0.12.3`)
- Upstream repository: <https://github.com/omdsh-dev/DSH-better-sidebar>
- Upstream license: MIT (preserved verbatim in [LICENSE](./LICENSE))
- Fork repository: <https://github.com/All3nCN/dsh-better-sidebar-N23>

The fork republishes under the `@all3cn` scope with a fresh `0.1.0` version
line. It carries no affiliation with or endorsement by DeepSeek, the DSH
team, or the upstream authors. All credit for the original plugin design and
implementation belongs to the upstream authors under the MIT license.

## Fork changes relative to upstream 0.12.3

1. During a right/bottom panel drag, fixed panels follow the pointer but do
   not write `--dsh-sidebar-width`/`--dsh-sidebar-height`. The central DSH
   conversation only resizes once when the persisted store value commits on
   pointer release. This prevents full-transcript reflow and frame skips.
2. The standard composer card is overridden to an 8px radius.
3. At a right-panel container width up to 320px, tab captions, close
   controls, and badges collapse to icon-only tabs; the native `title`
   remains available.
4. (2026-08-22, DSH core compat) newer DSH cores removed the
   `window.__DSH_MODULES__` page global: the shell kernel enrolls the
   ClientModuleSystem as the `modules` Cordis service, so lazy chunks
   (terminal/editor) failed with `chunk "editor": client module system
   unavailable`. `src/client/chunk-loader.ts` resolves the system through a
   context-bound instance (`bindModuleSystem`, called from
   `src/client/index.tsx` via optional `ctx.get?.("modules")`) with the
   legacy global kept as fallback for older cores.
5. (2026-08-31) Shell refactor: full-width 48px header, VSCode-style activity
   rail, global controls; workbench completed (see README feature list).
   Validated against DSH `0.1.1-rc.2`.

## Source / build note

Both `src/` and the shipped `lib/` bundle are tracked. They were
intentionally synchronized by hand (the fork checkout does not carry the
upstream tsdown/tsc build toolchain). Keep them synchronized: run the
upstream build in a dependency-complete checkout, then copy/commit `lib/`;
or explicitly review the intentionally mirrored compiled change.

## src/lib split-track state (2026-09-01 rollback incident)

- `src/` has been restored with the upstream 0.17.1 A-class robustness /
  security fixes (the `src/` half of the original A-class absorption).
- `lib/` intentionally stays on the accepted shell-refactor version: the shell
  CSS (three-zone bar, activity rail, compact header) was hand-mirrored into
  the compiled bundles and has not yet been written back to `src/`.
- Therefore `src/` and `lib/` are intentionally split-track: `src/` is ahead
  on robustness fixes, `lib/` is ahead on shell layout. Runtime behavior is
  governed by `lib/`, not `src/`.
- Before any full `tsc` + `tsdown` rebuild, the shell changes must first be
  written back to `src/`; otherwise the shell layout is wiped (the root cause
  of the 2026-09-01 rollback).
