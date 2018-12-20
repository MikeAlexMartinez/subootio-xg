'use strict';

const xgParser = require('./xg-parser');

main();

async function main() {
  const data = await xgParser();
  
  const fixtureData = data['datesData'];
  const flatFixtureData = flattenFixtureData(fixtureData);
  // console.log(flatFixtureData.length);
  const { completeFixtures, remainingFixtures } = splitAndSortFixtures(flatFixtureData);
  const upcomingFixtures = nextTen(remainingFixtures);
  const lastSixty = last60(completeFixtures);
  const teamLastSixSummary = calculateAverageXgLastSix(lastSixty);
  const upcomingFixturesWithLastSix = upcomingFixtures.map(f => {
    // home team
    const homeTeam = teamLastSixSummary[f.h_short_team_name];
    const h_xG_f_l6 = homeTeam.for / homeTeam.forCount;
    const h_xG_a_l6 = homeTeam.against / homeTeam.againstCount;
    // away team
    const awayTeam = teamLastSixSummary[f.a_short_team_name];
    const a_xG_f_l6 = awayTeam.for / awayTeam.forCount;
    const a_xG_a_l6 = awayTeam.against / awayTeam.againstCount;
    return {
      ...f,
      h_xG_f_l6,
      h_xG_a_l6,
      a_xG_f_l6,
      a_xG_a_l6,
    };
  });

  console.log(upcomingFixturesWithLastSix);
  return 0;
}

function calculateAverageXgLastSix(fixtures) {
  const teamHash = {};

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    const homeTeamShort = f.h_short_team_name;
    const awayTeamShort = f.a_short_team_name;
    // home team
    if (teamHash.hasOwnProperty(homeTeamShort)) {
      const currentStats = teamHash[homeTeamShort];
      teamHash[homeTeamShort] = {
        for: currentStats.for + +f.h_xG,
        forCount: currentStats.forCount + 1,
        against: currentStats.against + +f.a_xG,
        againstCount: currentStats.againstCount + 1,
      };
    } else {
      teamHash[homeTeamShort] = {
        for: +f.h_xG,
        forCount: 1,
        against: +f.a_xG,
        againstCount: 1
      };
    }
    // away team
    if (teamHash.hasOwnProperty(awayTeamShort)) {
      const currentStats = teamHash[awayTeamShort];
      teamHash[awayTeamShort] = {
        for: currentStats.for + +f.a_xG,
        forCount: currentStats.forCount + 1,
        against: currentStats.against + +f.h_xG,
        againstCount: currentStats.againstCount + 1,
      };
    } else {
      teamHash[awayTeamShort] = {
        for: +f.a_xG,
        forCount: 1,
        against: +f.h_xG,
        againstCount: 1
      };
    }
  }

  return teamHash;
}

function last60(array) {
  return array.slice(0, 60);
}

function nextTen(array) {
  return array.slice(0, 10);
}

function splitAndSortFixtures(fixtures) {
  const remainingFixturesUnsorted = [];
  const completeFixturesUnsorted = [];
  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    if (f.is_complete) {
      completeFixturesUnsorted.push(f);
    } else {
      remainingFixturesUnsorted.push(f);
    }
  }

  const remainingFixtures = remainingFixturesUnsorted.sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );
  const completeFixtures = completeFixturesUnsorted.sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );

  return  {
    remainingFixtures,
    completeFixtures
  };
}

function flattenFixtureData(fixtures) {
  return fixtures.map(f => {
    const id = f.id;
    const is_complete = f.isResult;
    const h_team_id = f.h.id;
    const h_team_name = f.h.title;
    const h_short_team_name = f.h.short_title;
    const h_goals = f.goals.h;
    const h_xG = f.xG.h;
    const a_team_id = f.a.id;
    const a_team_name = f.a.title;
    const a_short_team_name = f.a.short_title;
    const a_goals = f.goals.a;
    const a_xG = f.xG.a;
    const datetime = f.datetime;
    let hw_probability = null;
    let dr_probability = null;
    let aw_probability = null;
    if (f.forecast) {
      hw_probability = f.forecast.w ? f.forecast.w : null;
      dr_probability = f.forecast.d ? f.forecast.d : null;
      aw_probability = f.forecast.l ? f.forecast.l : null;
    }
    return {
      id,
      is_complete,
      h_team_id,
      h_team_name,
      h_short_team_name,
      h_goals,
      h_xG,
      a_team_id,
      a_team_name,
      a_short_team_name,
      a_goals,
      a_xG,
      datetime,
      hw_probability,
      dr_probability,
      aw_probability
    };
  });
}