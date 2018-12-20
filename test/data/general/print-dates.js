const datesData = require('./date-data');

const converted = JSON.parse(datesData);

console.log(converted);
/**
 * Date data example
 * 
 * 
 {  
    id: '9287',
    isResult: true,
    h: { 
      id: '89',
      title: 'Manchester United',
      short_title: 'MUN'
    },
    a: {
      id: '72',
      title: 'Everton',
      short_title: 'EVE'
    },
    goals: {
      h: '2',
      a: '1'
    },
    xG: {
      h: '2.52189',
      a: '1.64939'
    },
    datetime: '2018-10-28 15:00:00',
    forecast: {
      w: '0.6006',
      d: '0.2403',
      l: '0.1591'
    }
  }
 */