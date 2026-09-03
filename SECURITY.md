# Security Policy

## Scope

`@all3cn/dsh-better-sidebar-n23` mounts a real terminal (node-pty), a file
explorer, and an embedded browser inside DSH. This policy covers security
issues in this plugin, including its fork-specific changes.

## Reporting a vulnerability

Please report vulnerabilities privately, before any public disclosure:

- Preferred: GitHub Security Advisories on this repository
  (Security → Report a vulnerability).
- If the issue is not sensitive, a regular issue is fine.

Do not open a public issue for a live vulnerability.

## Trust model

- The HTML preview runs in a sandboxed iframe by default. Disabling the
  sandbox grants the previewed page same-origin access to session files and
  internal routes and should only be done for fully trusted files (see the
  settings descriptions).
- Host routes are fenced behind the DSH web server and the Host origin fence
  (`src/trust-fence.ts`).
- The terminal runs the user's shell with the user's privileges; do not feed
  it input you would not type yourself.

## Supported versions

Only the latest published version is supported. Report against the latest
release and note the exact version you observed.
