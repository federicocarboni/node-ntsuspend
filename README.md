# NtSuspend
Suspend and resume processes on Windows using `NtSuspendProcess()` and
`NtResumeProcess()`.

This project includes TypeScript declarations.

Feel free to ask anything by opening an issue on GitHub.

**Note:** Make sure to use this package as an optional dependency if you want to
support multiple operating systems.

**Only NodeJS 10.x or higher is officially supported**

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
