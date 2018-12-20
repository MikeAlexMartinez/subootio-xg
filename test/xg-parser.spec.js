// Node
const fs = require('fs');
const path = require('path');

// Testing
const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

// Additional dependencies
const cheerio = require('cheerio');
const testHtml = fs.readFileSync(path.resolve(__dirname, '../example/xgData.html'));

describe('xg-parser:' , () => {
  let xgParserModule;

  beforeEach(() => {
    xgParserModule = rewire('../xg-parser');
  });
  
  describe('parseScriptString()', () => {
    let parseScriptString;

    beforeEach(() => {
      parseScriptString = xgParserModule.__get__('parseScriptString');
    });
    
    it('should combine the objects returned from the functions as one merged object', () => {
      const extractData = () => ({
        test: 'two',
        different: 'answer'
      });
      const extractName = () => ({
        test: 'one',
        another: 'test'
      });
      xgParserModule.__set__('extractData', extractData);
      xgParserModule.__set__('extractName', extractName);

      const expectedObject = {
        test: 'one',
        another: 'test',
        different: 'answer'
      };

      const response = parseScriptString('test');
      expect(response).to.deep.equal(expectedObject);
    });
  });

  describe('extractData()', () => {
    let extractData;
    let cleanHexString;

    beforeEach(() => {
      extractData = xgParserModule.__get__('extractData');
      cleanHexString = () => '[{"clean": "string"}]';
      xgParserModule.__set__('cleanHexString', cleanHexString);
    });

    it('should return the input text as a property of the response', () => {
      const inputText = 'This is the input';
      const response = extractData(inputText);
      expect(response.input).to.equal(inputText);
    });

    it('should call cleanHexString() once', () => {
      const jsonDataString = cleanHexString();
      const inputText = `var input = JSON.parse('${jsonDataString}');`;
      const cleanHexStringSpy = sinon.fake.returns(jsonDataString);
      xgParserModule.__set__('cleanHexString', cleanHexStringSpy);
      extractData(inputText);

      expect(cleanHexStringSpy.callCount).to.equal(1);
    });

    it('should return the data string passed as the JSON.parse() function parameter', () => {
      const jsonDataString = cleanHexString();
      const inputText = `var input = JSON.parse('${jsonDataString}');`;
      const cleanHexStringSpy = sinon.fake.returns(jsonDataString);
      xgParserModule.__set__('cleanHexString', cleanHexStringSpy);
      const response = extractData(inputText);

      expect(response.content).to.equal(jsonDataString);
    });

    it('will return the content property with a null value if string isn\'t as valid', () => {
      const inputText = 'This is the input';
      const response = extractData(inputText);
      expect(response.content).to.be.null;
    });
  });

  describe('extractScripts()', () => {
    let extractScripts;

    beforeEach(() => {
      extractScripts = xgParserModule.__get__('extractScripts');
    });

    it('should detect three scripts in the sample xgData.html file', () => {
      const xgDataPage = cheerio.load(testHtml);
      const response = extractScripts(xgDataPage);

      expect(response.length).to.equal(3);
    });
  });

  describe('extractName()', () => {
    let extractName;

    beforeEach(() => {
      extractName = xgParserModule.__get__('extractName');
    });

    it('should return the input text as a property of the respone', () => {
      const inputText = 'This is the input';
      const response = extractName(inputText);
      expect(response.input).to.equal(inputText);
    });

    it('should return a string for name property if match found', () => {
      const inputText = 'var variableName = JSON.parse(\'[{}]\');';
      const response = extractName(inputText);
      const expected = {
        name: 'variableName',
        input: inputText
      };
      expect(response).to.deep.equal(expected);
    });

    it('should return null for name property if no match found', () => {
      const inputText = 'This is the input';
      const response = extractName(inputText);
      const expected = {
        name: null,
        input: inputText
      };
      expect(response.name).to.be.null;
    });

    it('should handle multiple spaces between main sections of the input text', () => {
      const inputText = 'var  variableName  =    JSON.parse(\'[{}]\');';
      const response = extractName(inputText);
      const expected = {
        name: 'variableName',
        input: inputText
      };
      expect(response).to.deep.equal(expected);
    });
  });

  describe('main()', () => {
    let main;
    let fetchData;

    beforeEach(() => {
      const html = cheerio.load(testHtml);
      fetchData = () => Promise.resolve({ body: html });
      xgParserModule.__set__('fetchData', fetchData);
      main = xgParserModule.__get__('main');
    });

    it('should return', async (done) => {
      let result = main();

      Object.keys(result).forEach(key => {
        console.log(`variable name: ${key}`);
      });

      Object.keys(result).forEach(key => {
        const data = result[key];
        console.log(data);
      });
    });
  });
});
