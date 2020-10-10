import { createInterface as readlines } from 'readline';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import { strictEqual } from 'assert';

import * as esm from '../lib.mjs';

const cjs = createRequire(import.meta.url)('../lib.js');

const isWin32 = process.platform === 'win32';

if (isWin32) {
  it('esm.suspend === cjs.suspend', function () {
    strictEqual(cjs.suspend, esm.suspend);
  });
  it('esm.resume === cjs.resume', function () {
    strictEqual(cjs.resume, esm.resume);
  });
  for (const func of ['suspend', 'resume']) {
    describe(`${func}()`, function () {
      it('returns false on non-existent process id', function () {
        // `3` should never be valid process id on Windows.
        // suggestions are welcome ;)
        strictEqual(esm[func](3), false);
      });
      it('returns false on non-numeric process id', function () {
        strictEqual(esm[func]('string'), false);
        strictEqual(esm[func](void 0), false);
        strictEqual(esm[func](null), false);
        strictEqual(esm[func](true), false);
        strictEqual(esm[func](Symbol()), false);
        strictEqual(esm[func]({ key: 'value' }), false);
      });
    });
  }
  describe('suspend() & resume()', function () {
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
} else {
  it('cjs.suspend === undefined', function () {
    strictEqual(cjs.suspend, void 0);
  });
  it('cjs.resume === undefined', function () {
    strictEqual(cjs.resume, void 0);
  });
  it('esm.suspend === undefined', function () {
    strictEqual(esm.suspend, void 0);
  });
  it('esm.resume === undefined', function () {
    strictEqual(esm.resume, void 0);
  });
}
