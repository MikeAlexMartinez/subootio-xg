const hexMap = {
  'x2d': '-',
  'x20': ' ',
  'x21': '!',
  'x22': '"',
  'x23': '#',
  'x24': '$',
  'x25': '%',
  'x26': '&',
  'x27': '\'',
  'x28': '(',
  'x29': ')',
  'x2a': '*',
  'x2b': '+',
  'x2c': ',',
  'x2e': '.',
  'x2f': '/',
  'x3a': ':',
  'x3b': ';',
  'x3c': '<',
  'x3d': '=',
  'x3e': '>',
  'x3f': '?',
  'x40': '@',
  'x5b': '[',
  'x5c': '\\',
  'x5d': ']',
  'x5e': '^',
  'x5f': '_',
  'x60': '`',
  'x7b': '{',
  'x7c': '|',
  'x7d': '}',
  'x7e': '~',
  'x7f': '',
};

/**
 * 
 * @param {string} hexString
 * @returns {string}
 */
module.exports = (hexString) => {
  const len = hexString.length;
  let cleanString = '';
  for(let i = 0; i < len; i++) {
    const char = hexString[i];
    if (char === '\\') {
      const slice = hexString.slice(i + 1, i + 4).toLowerCase();
      const replace = hexMap[slice];
      cleanString += replace;
      i += 3;
    } else {
      cleanString += char;
    }
  }
  return cleanString;
}
