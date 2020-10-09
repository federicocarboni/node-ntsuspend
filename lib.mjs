import { createRequire } from 'module';

let suspend = void 0;
let resume = void 0;

if (process.platform === 'win32') {
  const lib = createRequire(import.meta.url)(`./win32-${process.arch}_lib.node`);
  suspend = lib.suspend;
  resume = lib.resume;
}

export { suspend, resume };
