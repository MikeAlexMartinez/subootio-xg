const fs = require('fs');
const path = require('path');

const rp = require('request-promise');
const cheerio = require('cheerio');

const cleanHexString = require('./utils/clean-hex-string');
const testHtml = fs.readFileSync(path.resolve(__dirname, './example/xgData.html'));

module.exports = main;

async function loadData() {
  return {
    body: cheerio.load(testHtml)
  };
}

async function main() {
  const { error, body } = await fetchData(); // loadData();

  const data = extractScripts(body);
  const cleanData = data.map(d => {
    const data = parseScriptString(d);
    let parsedContent;

    try {
      parsedContent = JSON.parse(data.content);
    } catch (e) {
      console.error(e);
    }

    return {
      ...data,
      content: parsedContent
    };
  });

  const dataHash = transformData(cleanData);

  return dataHash;
}

/**
 @typedef xGPlayerData
 @type {object}
 */

/**
 @typedef xGTeamData
 @type {object}
 */

/**
 @typedef xGDataData
 @type {object}
 */

/**
 @typedef xGDataHash
 @type {object}
 @property {} playerData
 */

/**
 * takes an array of strings extracted from the bodies of understats embedded script
 * tags and converts them to extract the variable name, and core data stored in each.
 * @param {Array.string}
 * @returns {xGDataHash}
 */
function transformData(dataArray) {
  const hash = {};
  
  return dataArray.reduce((prev, curr) => {
    prev[curr.name] = curr.content;
    return prev;
  }, hash)
}

/**
 * this function combines the results from extracting the variable name 
 * and the data contained in a specific script body
 * @param {string} scriptText
 * @returns {ParserScriptData}
 */
function parseScriptString(scriptText) {
  return Object.assign(
    {},
    extractData(scriptText),
    extractName(scriptText)
  );
}

/**
 @typedef ParserScriptData
 @type {object}
 @property {?string} name - the variable name assigned to the main script data
 @property {?any} content - a json object constructed from main data in script
 @property {string} input - the input used to define the object
 */

/**
 * extracts the variable name used to capture the data passed to JSON.parse()
 * @param {string} scriptText
 * @returns {ParserScriptData}
 */
function extractName(scriptText) {
  const regexStart = /var\s+/;
  const regexEnd = /\s+=\s+JSON\.parse\(/;
  const start = regexStart.exec(scriptText);
  const end = regexEnd.exec(scriptText);
  let startIndex;
  let endIndex;
  let variableName = null;

  if (start) {
    startIndex = start[0].length + start.index;
  }
  if (end) {
    endIndex = end.index;
  }
  if (startIndex && endIndex) {
    variableName = scriptText.slice(startIndex, endIndex);
  }
  return {
    name: variableName,
    input: scriptText,
  };
}

/**
 * Takes a string and selects any text found between the first instance
 * of "a JSON.parse('" and "')", which should represent the data used
 * in the xG website
 * @param {string} scriptText
 * @returns {ParserScriptData}
 */
function extractData(scriptText) {
  const regex1 = /JSON\.parse\('/;
  const start = regex1.exec(scriptText);
  const regex2 = /'\)/;
  const end = regex2.exec(scriptText);
  let startIndex;
  let endIndex;
  let dataString;
  let cleanData = null;
  
  if (start) {
    startIndex = start[0].length + start.index;
  }
  if (end) {
    endIndex = end.index;
  }
  if (startIndex && endIndex) {
    dataString = scriptText.slice(startIndex, endIndex);
  }
  if (dataString) {
    cleanData = cleanHexString(dataString);
  }
  return {
    content: cleanData,
    input: scriptText
  };
}

/**
 * 
 * @param {CheerioStatic} xgData
 * @returns {Array.<string>}
 */
function extractScripts(xgData) {
  const $ = xgData;
  const scripts = $('.page-wrapper').find('script')
  const scriptCount = $('.page-wrapper').find('script').length;
  const scriptContent = [];
  for (let i = 0; i < scriptCount; i++) {
    const data = scripts[i].children[0].data;
    scriptContent.push(data);
  }
  return scriptContent;
}

/**
 @typedef FetchResponse
 @type {object}
 @property {Error} error - If an error occured it's stored here
 @property {CheerioStatic} body - html page as loaded by cheerio
 */

/**
 *
 * @returns {FetchResponse}
 */
function fetchData() {
  return new Promise(async (res, rej) => {
    let xGData;

    const options = {
      uri: 'https://understat.com/league/EPL',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    try {
      xGData = await rp(options);
    } catch (e) {
      console.error(e);
      res({
        error: e,
        body: null
      });
    }

    res({
      error: null,
      body: xGData
    });
  });
}
