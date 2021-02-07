import _module from 'module';

let suspend;
let resume;

if (process.platform === 'win32') {
  const ntsuspend = (typeof require === 'function' ? require : _module.createRequire(import.meta.url))(`./win32-${process.arch}_lib.node`);
  suspend = ntsuspend.suspend;
  resume = ntsuspend.resume;
}

export { suspend, resume };
