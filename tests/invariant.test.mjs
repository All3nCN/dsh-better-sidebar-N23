import assert from 'node:assert/strict';
import { test } from 'node:test';

import { apply, inject, name } from '../lib/invariant.js';

test('invariant companion declares its name and inject list', () => {
  assert.equal(name, 'dsh-better-sidebar-invariant');
  assert.deepEqual(inject, ['invariants']);
});

test('apply registers the package invariant through the context', async () => {
  let captured;
  const disposer = { dispose() {} };
  const ctx = {
    invariants: {
      register(pkg, install) {
        captured = { pkg, install };
        return disposer;
      },
    },
  };

  const result = await apply(ctx);

  assert.equal(captured.pkg, 'dsh-better-sidebar');
  assert.equal(typeof captured.install, 'function');
  assert.equal(result, disposer);
});
