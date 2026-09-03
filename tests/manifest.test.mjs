import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'dsh-plugin.json'), 'utf8'));

const stripDotSlash = (p) => p.replace(/^\.\//, '');

test('manifest name and version match package.json', () => {
  assert.equal(manifest.name, pkg.name);
  assert.equal(manifest.version, pkg.version);
});

test('manifest entry points resolve to shipped files', () => {
  assert.equal(manifest.entry.host, stripDotSlash(pkg.exports['.'].default));
  assert.equal(manifest.entry.client, stripDotSlash(pkg.exports['./client'].default));
  assert.ok(existsSync(join(root, manifest.entry.host)));
  assert.ok(existsSync(join(root, manifest.entry.client)));
});

test('bundle patch declaration is consistent and present', () => {
  assert.equal(manifest.bundlePatch, stripDotSlash(pkg.dsh.bundle.patch));
  assert.ok(existsSync(join(root, manifest.bundlePatch)));
});
