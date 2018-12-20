const teamsData = require('./team-data');

const parsedData = JSON.parse(teamsData);

const wolvesHistory = parsedData['229'].history;
console.log(wolvesHistory);
/**
  {
    [id: number]: {
      id: '229',
      title: 'Wolverhampton Wanderers',
      history: [
        {
          h_a: 'h',   // home or away
          xG: 0.682956,   // expected goals
          xGA: 1.46775,   // expected goals against
          npxG: 0.682956,   // net points, expected goals
          npxGA: 1.46775,   // net points, expected goals against
          ppda: { att: 407, def: 33 },   // passes per defensive action
          ppda_allowed: { att: 154, def: 22 },   // passes per defensive action allowed
          deep: 3,   // deep passes within 20 metres of opponents goal
          deep_allowed: 5,   // deep passes within 20 metres of own goal
          scored: 2,   // main chances scored
          missed: 1,   // main chances missed
          xpts: 0.7217,   // expected points
          result: 'w',   // result
          date: '2018-12-05 19:45:00',   // date
          wins: 1,   // wins
          draws: 0,   // draws
          loses: 0,   // losses
          pts: 3,   // points
          npxGD: -0.7847940000000001 // net points expected goal difference
        }
      ]
    }
  }
 */