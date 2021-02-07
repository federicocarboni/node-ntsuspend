'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.suspend = exports.resume = void 0;

if (process.platform === 'win32') {
  const ntsuspend = require(`./win32-${process.arch}_lib.node`);
  exports.suspend = ntsuspend.suspend;
  exports.resume = ntsuspend.resume;
}
