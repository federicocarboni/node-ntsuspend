'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.suspend = exports.resume = void 0;

if (process.platform === 'win32') {
  const lib = require(`./win32-${process.arch}_lib.node`);
  exports.suspend = lib.suspend;
  exports.resume = lib.resume;
}
