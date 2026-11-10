const { UAParser } = require('ua-parser-js');

// LINE in-app browser appends "Line/<version>" to the UA on both iOS and Android
const LINE_UA = /\bLine\/[\d.]+/i;

function detectLine(userAgent) {
  const result = new UAParser(userAgent || '').getResult();
  const osName = (result.os.name || '').toLowerCase();
  const os = osName === 'ios' ? 'ios' : osName === 'android' ? 'android' : 'other';
  const isLine = result.browser.name === 'Line' || LINE_UA.test(userAgent || '');
  const match = (userAgent || '').match(/\bLine\/([\d.]+)/i);

  return {
    isLine,
    os,
    isLineIOS: isLine && os === 'ios',
    isLineAndroid: isLine && os === 'android',
    lineVersion: isLine ? (match ? match[1] : result.browser.version || null) : null,
    osVersion: result.os.version || null,
  };
}

module.exports = { detectLine };
