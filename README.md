# NtSuspend
This library to suspend and resume processes on Windows.
Uses `NtSuspendProcess()` and `NtResumeProcess()`.

TypeScript declarations are included.

Feel free to ask anything by opening an issue on the GitHub repo.

**Only NodeJS 10.x or higher is officially supported**

## Install
Install the library from NPM:

`npm i ntsuspend`

or from GitHub:

`npm i FedericoCarboni/node-ntsuspend`

To use it in your project you can use `import` or `require()`.
```ts
import { suspend, resume } from 'ntsuspend';
```
```ts
const { suspend, resume } = require('ntsuspend');
```

## Usage
The package exports `suspend()` and `resume()`, if you're not on Windows they
will be `undefined`.

`suspend()` and `resume()` take the process' PID and they return `true` on
success, `false` otherwise.
