'use strict';
const fs = require('fs');
const XLSX = require('xlsx');

const wb = XLSX.utils.book_new();

const ws_name = 'output';

module.exports = function createOutput(teamData) {
  const data = [
    [
      'team_id',
      'team_name',
      'short_team_name',
      'xG_f_l6',
      'xG_a_l6'
    ]
  ];

  teamData.forEach((element, i) => {
    const homeRow = [];
    homeRow.push(element['h_team_id']);
    homeRow.push(element['h_team_name']);
    homeRow.push(element['h_short_team_name']);
    homeRow.push(element['h_xG_f_l6']);
    homeRow.push(element['h_xG_a_l6']);
    data.push(homeRow);

    const awayRow = [];
    awayRow.push(element['a_team_id']);
    awayRow.push(element['a_team_name']);
    awayRow.push(element['a_short_team_name']);
    awayRow.push(element['a_xG_f_l6']);
    awayRow.push(element['a_xG_a_l6']);
    data.push(awayRow);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  // check output folder exists
  const dir = `./${ws_name}`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  XLSX.writeFile(wb, `${dir}/output.xlsx`);
}
