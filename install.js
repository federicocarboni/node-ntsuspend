'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const install = async () => {
  const https = require('https');
  const path = require('path');
  const fs = require('fs');
  const pkg = require('./package.json');

  const cwd = process.cwd();

  const request = (url) => {
    const { hostname, port, pathname, search } = new URL(url);
    const options = {
      hostname,
      port: port || '443',
      path: pathname + search,
      method: 'GET',
    };
    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        if (res.statusCode === 302) {
          resolve(request(res.headers.location));
        } else {
          resolve(res);
        }
      });
      req.end();
    });
  };

  const url = `https://github.com/FedericoCarboni/node-ntsuspend/releases/download/v${pkg.version}/win32-${process.arch}_lib.node`;
  const dest = path.join(__dirname, `win32-${process.arch}_lib.node`);

  console.debug(`Downloading '${path.relative(cwd, dest)}' from '${url}'...`);

  const response = await request(url);
  response.pipe(fs.createWriteStream(dest));
};

if (process.platform === 'win32' && (process.arch === 'x64' || process.arch === 'ia32'))
  install();
