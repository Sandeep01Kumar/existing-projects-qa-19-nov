const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');

require('../server.js');

const EXPECTED_BODY = 'Hello, World!\n';

let failed = false;

function send(method, path) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer;
    const settle = (fn, value) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const req = http.request({ host: '127.0.0.1', port: 3000, method, path }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => settle(resolve, { status: res.statusCode, body }));
      res.on('error', (err) => settle(reject, err));
    });
    req.on('error', (err) => settle(reject, err));
    timer = setTimeout(() => {
      settle(reject, new Error('request timed out after 2000 ms'));
      req.destroy();
    }, 2000);
    req.end();
  });
}

// An ordinary GET / is answered with the contract: status 200 and the exact 14-byte body.
test('GET / returns 200 and the exact body', async () => {
  try {
    const { status, body } = await send('GET', '/');
    assert.equal(status, 200);
    assert.equal(body, EXPECTED_BODY);
  } catch (err) {
    failed = true;
    throw err;
  }
});

// The handler never reads its request, so a different method on the same path is answered identically.
test('POST / is answered identically', async () => {
  try {
    const { status, body } = await send('POST', '/');
    assert.equal(status, 200);
    assert.equal(body, EXPECTED_BODY);
  } catch (err) {
    failed = true;
    throw err;
  }
});

// The module under test exposes no handle to close, so end the process once both cases have reported.
test.after(() => setTimeout(() => process.exit(failed ? 1 : 0), 0));
