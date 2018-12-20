const playerData = require('./players-data');

const parsedData = JSON.parse(playerData);

console.log(parsedData);

/**
 * 
  {
    id: '552',
    player_name: 'Ander Herrera',
    games: '8',
    time: '372',
    goals: '1',
    xG: '0.5416090004146099',
    assists: '1',
    xA: '0.7478841692209244',
    shots: '9',
    key_passes: '4',
    yellow_cards: '1',
    red_cards: '0',
    position: 'D M S',
    team_title: 'Manchester United',
    npg: '1',
    npxG: '0.5416090004146099',
    xGChain: '0.9063754864037037',
    xGBuildup: '0.3532439339905977'
  }
 */