import { useState, useEffect } from 'react';
import qgame from './qgames.log';
import Papa from 'papaparse';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function App() {
  const [gameData, setGameData] = useState();
  let match = {}
  let death_cause_by_match = {}
  let player_ranking = {}

  useEffect(() => {
    const readLogFile = async () => {
      const res = await fetch(qgame);
      const reader = res.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const text = await decoder.decode(result.value);
  
      Papa.parse(text, {
        complete: function(results) {
          setGameData(results.data);
        }
      });
    }
    readLogFile();
  }, [])

  const getMatchData = () => {
    let count = 0;
    gameData?.forEach((line) => {
      if (line[0].includes('InitGame')) {
        count += 1;
        match[`game_${count}`] = {
          total_kills: 0,
          players: [],
          kills: {},
        }

        death_cause_by_match[`game-${count}`] = {
          kills_by_means: {}
        }
      }

      if (line[0].includes('ClientUserinfoChanged')) {
        const split1 = line[0].split('n\\');
        const split2 = split1[1].split('\\t');
        const playerName = split2[0];
        if (!match[`game_${count}`].players.includes(playerName)) {
          match[`game_${count}`].players.push(playerName);
          match[`game_${count}`].kills[playerName] = 0;

          if (playerName in player_ranking === false) {
            player_ranking[playerName] = 0;
          }
        }
      }

      if (line[0].includes('Kill')) {
        const split1 = line[0].split(':');
        const split2 = split1[3].split('by');
        const death_cause = split2[1].trim();
        const split3 = split2[0].split('killed');
        const killer = split3[0].trim();
        const deadPlayer = split3[1].trim();

        if (death_cause in death_cause_by_match[`game-${count}`].kills_by_means) {
          death_cause_by_match[`game-${count}`].kills_by_means[death_cause] += 1;
        } else {
          death_cause_by_match[`game-${count}`].kills_by_means[death_cause] = 1;
        }

        Object.keys(match[`game_${count}`].kills).forEach((key, index) => {
          if (killer === '<world>' && deadPlayer === key) {
            match[`game_${count}`].total_kills += 1;
            match[`game_${count}`].kills[deadPlayer] -= 1;
          }
          if (key === killer) {
            match[`game_${count}`].total_kills += 1;
            match[`game_${count}`].kills[key] += 1;

            player_ranking[key] += 1;
          }
        })
      }
    })
  }
  getMatchData();

  let playerRankingData = Object.keys(player_ranking).map(key => {
    let obj = {
      player: key,
      kills: player_ranking[key]
    }
    return obj;
  })
  playerRankingData.sort((playerA, playerB) => playerB.kills - playerA.kills);

  return (
    <div className="container">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Reports of each match" key="1">
          <pre>{JSON.stringify(match, null, 2)}</pre>
        </TabPane>
        <TabPane tab="Death cause report by match" key="2">
          <pre>{JSON.stringify(death_cause_by_match, null, 2)}</pre>
        </TabPane>
        <TabPane tab="Player Ranking" key="3">
          {playerRankingData.map((player, index) => {
            return (
              <div className="rankingPosition">
                <p>{index+1}°: </p>
                <p className="playerName">{player.player}</p>
                <p>{player.kills}</p>
              </div>
            )
          })}
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
