#!/usr/bin/env node
/**
 * Build-free registry packaging for @all3cn/dsh-better-sidebar-n23.
 *
 * This fork ships its compiled `lib/` directly (see UPSTREAM.md: `src/` and
 * `lib/` are synchronized by hand; the repo carries no tsc/tsdown build
 * toolchain). This script therefore packages artifacts WITHOUT building:
 *
 *   1. Validates that every file listed in package.json `files` exists,
 *      including the shipped lib bundles and the cordis patch.
 *   2. Emits `dist/dsh-plugin.json` — a plugin manifest derived from
 *      package.json + the checked-in dsh-plugin.json (fork-local convention,
 *      consumed by release tooling; not required by the `dsh plugin` CLI,
 *      which reads the `dsh` field of package.json).
 *   3. Runs `npm pack --ignore-scripts` into `dist/` to produce the exact
 *      npm-style tarball that `npm publish` would push, so contents can be
 *      audited (or handed to a future DSH plugin registry) without a build
 *      and without npm credentials.
 *
 * Usage:
 *   node scripts/package-registry.mjs            # package into dist/
 *   node scripts/package-registry.mjs --dry-run  # validate + list, no files written
 *
 * Exit code is non-zero on any missing artifact or pack failure.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run") || process.argv.includes("-n");
const distDir = join(root, "dist");

const fail = (msg) => { console.error(`[package-registry] ERROR: ${msg}`); process.exit(1); };
const log = (msg) => console.log(`[package-registry] ${msg}`);

// --- 1. load package.json + manifest ----------------------------------------
const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) fail("package.json not found");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

if (!pkg.name || pkg.name !== "@all3cn/dsh-better-sidebar-n23") {
  fail(`unexpected package name: ${pkg.name ?? "(none)"}`);
}
if (!pkg.version) fail("package.json has no version");
if (pkg.dsh?.bundle?.patch !== "./cordis.patch.yml") {
  fail('package.json must declare dsh.bundle.patch = "./cordis.patch.yml"');
}

const manifestPath = join(root, "dsh-plugin.json");
if (!existsSync(manifestPath)) fail("dsh-plugin.json manifest not found");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.version !== pkg.version) {
  fail(`version drift: package.json ${pkg.version} vs dsh-plugin.json ${manifest.version}`);
}
if (manifest.name !== pkg.name) fail(`manifest name mismatch: ${manifest.name}`);

// --- 2. expand the `files` allowlist (literal paths + glob-ish entries) ------
const globToRegex = (entry) => {
  // supports the subset npm `files` uses here: `**`, `*`, path separators
  const re = entry
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*");
  return new RegExp(`^${re}$`);
};

const walk = (dir) => {
  const out = [];
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
};

const shipped = [];
for (const entry of pkg.files ?? []) {
  if (entry.startsWith("scripts/") || entry.endsWith(".md") || entry === "LICENSE" ||
      entry === "cordis.patch.yml" || entry === "dsh-plugin.json" || entry === "package.json") {
    const p = join(root, entry);
    if (!existsSync(p)) fail(`files entry missing on disk: ${entry}`);
    shipped.push(entry);
    continue;
  }
  // lib entries may be literal files or type-dir globs
  if (entry.includes("*")) {
    const re = globToRegex(entry);
    const dirBase = entry.split("/").findIndex((s) => s.includes("*"));
    const baseDir = join(root, entry.slice(0, dirBase === -1 ? undefined : entry.split("/").slice(0, dirBase).join("/")));
    const all = existsSync(baseDir) ? walk(baseDir).map((p) => p.slice(root.length + 1)) : [];
    const hits = all.filter((rel) => re.test(rel));
    if (hits.length === 0) fail(`files glob matched nothing: ${entry}`);
    shipped.push(...hits);
  } else {
    const p = join(root, entry);
    if (!existsSync(p)) fail(`files entry missing on disk: ${entry}`);
    shipped.push(entry);
  }
}

// core runtime artifacts must be present and non-empty
for (const must of ["lib/index.js", "lib/client.js", "lib/invariant.js", "cordis.patch.yml"]) {
  const p = join(root, must);
  if (!existsSync(p) || statSync(p).size === 0) fail(`core artifact missing or empty: ${must}`);
}

log(`package ${pkg.name}@${pkg.version}`);
log(`validated ${shipped.length} shipped artifacts (files allowlist OK)`);

// --- 3. emit manifest + npm-style tarball -----------------------------------
if (dryRun) {
  log("dry-run: skipping dist/ write and npm pack");
  for (const f of shipped.sort()) log(`  would ship: ${f}`);
  process.exit(0);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const outManifest = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  files: shipped.sort(),
};
writeFileSync(join(distDir, "dsh-plugin.json"), JSON.stringify(outManifest, null, 2) + "\n");
log(`wrote dist/dsh-plugin.json (${shipped.length} files listed)`);

try {
  execFileSync("npm", ["pack", "--ignore-scripts"], { cwd: root, stdio: "inherit" });
} catch {
  fail("npm pack failed");
}
const tgzName = `all3cn-dsh-better-sidebar-n23-${pkg.version}.tgz`;
const tgz = join(root, tgzName);
if (!existsSync(tgz)) fail(`expected tarball ${tgzName} not produced in ${root}`);
cpSync(tgz, join(distDir, tgzName));
rmSync(tgz);
log(`wrote dist/${tgzName}`);
log("done — audit with: tar -tzf dist/" + tgzName);
