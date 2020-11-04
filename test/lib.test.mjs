import { createInterface as readlines } from 'readline';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import { strictEqual } from 'assert';

import * as esm from '../lib.mjs';

const cjs = createRequire(import.meta.url)('../lib.cjs');

const isWin32 = process.platform === 'win32';

for (const func of ['suspend', 'resume']) {
  describe(`${func}()`, function () {
    (isWin32 ? it.skip : it)(`esm.${func} === undefined on non-win32`, function () {
      strictEqual(esm[func], void 0);
    });
    (isWin32 ? it.skip : it)(`cjs.${func} === undefined on non-win32`, function () {
      strictEqual(cjs[func], void 0);
    });
    (isWin32 ? it : it.skip)(`esm.${func} === cjs.${func}`, function () {
      strictEqual(cjs[func], esm[func]);
    });
    (isWin32 ? it : it.skip)('returns false on non-existent process id', function () {
      // `3` should never be valid process id on Windows.
      // suggestions are welcome ;)
      strictEqual(esm[func](3), false);
    });
    (isWin32 ? it : it.skip)('returns false on non-numeric process id', function () {
      strictEqual(esm[func]('string'), false);
      strictEqual(esm[func](void 0), false);
      strictEqual(esm[func](null), false);
      strictEqual(esm[func](true), false);
      strictEqual(esm[func](Symbol()), false);
      strictEqual(esm[func]({ key: 'value' }), false);
    });
  });
}

(isWin32 ? describe : describe.skip)('suspend() & resume()', function () {
  let spawned;
  this.beforeEach(() => {
    spawned = spawn(process.argv0, ['test/process.js'], { stdio: 'pipe' });
  });
  this.afterEach(() => {
    if (spawned.exitCode === null || spawned.exitCode === void 0)
      spawned.kill();
    spawned = null;
  });
  it('suspends and resumes a running process', async function () {
    let suspended = false;
    let k = 0;
    for await (const line of readlines(spawned.stdout)) {
      strictEqual(suspended, false, 'stdout ');
      strictEqual(parseInt(line), k++);
      if (k === 2) {
        setTimeout(() => {
          strictEqual(esm.resume(spawned.pid), true, 'resume returned false');
          suspended = false;
        }, 80);
        strictEqual(esm.suspend(spawned.pid), true, 'suspend returned false');
        suspended = true;
      } else if (k === 3) return;
    }
  });
});
