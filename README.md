# NtSuspend
Suspend and resume processes on Windows using `NtSuspendProcess()` and
`NtResumeProcess()`. This is a Node.js only module, it won't run in any
browser or other JavaScript environments.

This project includes TypeScript declarations.

Feel free to ask anything by opening an issue on GitHub.

**Only NodeJS 10.x or higher is supported**

## Install
Install the library from NPM:

`npm i ntsuspend`

or from GitHub:

`npm i FedericoCarboni/node-ntsuspend`

To use it in your project you can `import` or `require()` it.
```ts
import { suspend, resume } from 'ntsuspend';
```
```ts
const { suspend, resume } = require('ntsuspend');
```

**Note:** Make sure to use this package as an optional dependency if you want to
support multiple operating systems. Optional imports in ESM can be achieved with
top-level `await`, still unavailable in LTS releases, and dynamic `import` or by
using [`createRequire()`](https://nodejs.org/dist/latest-v12.x/docs/api/modules.html#modules_module_createrequire_filename).

```ts
if (process.platform === 'win32') {
  const ntsuspend = await import('ntsuspend');
  // ... use ntsuspend
}
```

```ts
import { createRequire } from 'module';

if (process.platform === 'win32') {
  const ntsuspend = createRequire(import.meta.url)('ntsuspend');
  // ... use ntsuspend
}
```

In CommonJS `require()` can already be used conditionally.

```ts
if (process.platform === 'win32') {
  const ntsuspend = require('ntsuspend');
  // ... use ntsuspend
}
```

## Usage
The package exports `suspend()` and `resume()`, they take the process' PID and
return `true` on success, `false` otherwise.

```ts
if (!suspend(pid))
  console.log('Could not suspend process');
if (!resume(pid))
  console.log('Could not resume process');
```

**Note:** If you're not on Windows `suspend()` and `resume()` will be `undefined`.

## Disclaimer
This library uses `NtSuspendProcess()` and `NtResumeProcess()` from `NTDLL`, these functions are not
officially documented on MSDN; they have been consistently available since Windows XP, but are not
guaranteed to work in the future.
