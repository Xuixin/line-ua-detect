const test = require('node:test');
const assert = require('node:assert');
const { detectLine } = require('./index');

const UA = {
  lineIOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.5.0',
  lineAndroid:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.82 Mobile Safari/537.36 Line/14.6.1/IAB',
  safariIOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36',
};

test('LINE on iOS', () => {
  const r = detectLine(UA.lineIOS);
  assert.equal(r.isLine, true);
  assert.equal(r.isLineIOS, true);
  assert.equal(r.lineVersion, '14.5.0');
});

test('LINE on Android', () => {
  const r = detectLine(UA.lineAndroid);
  assert.equal(r.isLine, true);
  assert.equal(r.isLineAndroid, true);
  assert.equal(r.lineVersion, '14.6.1');
});

test('not LINE', () => {
  assert.equal(detectLine(UA.safariIOS).isLine, false);
  assert.equal(detectLine(UA.chromeAndroid).isLine, false);
  assert.equal(detectLine('').isLine, false);
});
