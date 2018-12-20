const testString = `\\x5B\\x7B\\x22Key\\x22\\x3A\\x20\\x22Value\\x22\\x2C\\x22KeyTwo\\x22\\x3A\\x20\\x22Value\\x20Two\\x22\\x2C\\x22KeyThree\\x22\\x3A\\x20\\x22Value_Three\\x22\\x2C\\x22KeyFour\\x22\\x3A\\x2010.5\\x7D\\x2C\\x7B\\x22Key\\x22\\x3A\\x20\\x22Value\\x22\\x2C\\x22KeyTwo\\x22\\x3A\\x20\\x22Value\\x20Two\\x22\\x2C\\x22KeyThree\\x22\\x3A\\x20\\x22Value_Three\\x22\\x2C\\x22KeyFour\\x22\\x3A\\x2020.5\\x7D\\x5D`;

const expectedObject = [
  {
    Key: 'Value',
    KeyTwo: 'Value Two',
    KeyThree: 'Value_Three',
    KeyFour: 10.5,
  },
  {
    Key: 'Value',
    KeyTwo: 'Value Two',
    KeyThree: 'Value_Three',
    KeyFour: 20.5,
  }
];

module.exports = {
  testString,
  expectedObject
};
