const expect = require('chai').expect;
const rewire = require('rewire');

const cleanHexModule = rewire('../../utils/clean-hex-string');
const cleanHexString = require('../../utils/clean-hex-string');

const {
  testString,
  expectedObject
} = require('../data/test-object')

describe('cleanHexString():', () => {
  let hexMap;

  beforeEach(() => {
    hexMap = cleanHexModule.__get__('hexMap');
  });

  describe('Replace hex like groups with character', () => {
    it('should replace all instances of hex in string', () => {
      const string = '\\x7Ba\\x7Ba\\x7B';
      const expectedString = '{a{a{';
      const result = cleanHexString(string);
      expect(result).to.equal(expectedString);
    });
    it('should create parseable string', () => {
      const result = cleanHexString(testString);
      const parsed = JSON.parse(result);
      expect(parsed).to.deep.equal(expectedObject);
    })
  });
});
