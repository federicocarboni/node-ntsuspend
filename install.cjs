'use strict';

const GITHUB_REPO = 'https://github.com/FedericoCarboni/node-ntsuspend';

const install = async () => {
  const https = require('https');
  const path = require('path');
  const fs = require('fs');
  const url = require('url');
  const pkg = require('./package.json');

  const fetch = (input) => {
    const { hostname, port, pathname, search } = new url.URL(input);
    const options = {
      hostname,
      port: port || '443',
      path: pathname + search,
      method: 'GET',
    };
    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        if (res.statusCode === 302) {
          resolve(fetch(res.headers.location));
        } else {
          resolve(res);
        }
      });
      req.end();
    });
  };

  const filename = `win32-${process.arch}_lib.node`;
  const download = `${GITHUB_REPO}/releases/download/v${pkg.version}/${filename}`;
  const dest = path.join(__dirname, filename);
  const response = await fetch(download);
  console.log(`NtSuspend Native Addon found at ${download}`);
  const stream = fs.createWriteStream(dest);
  stream.once('close', () => {
    console.log(`NtSuspend Native Addon downloaded to ${path.relative('.', dest)}`);
  });
  response.pipe(stream);
};

const { platform, arch, env: { SKIP_NTSUSPEND_BINARY } } = process;
if (!SKIP_NTSUSPEND_BINARY && platform === 'win32' && ['x64', 'ia32'].indexOf(arch) >= 0)
  install();
