import { useState, useEffect } from 'react';
import qgame from './qgames.log';
import Papa from 'papaparse';

function App() {
  const [gameData, setGameData] = useState();
  let match = {}

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
      }

      if (line[0].includes('ClientUserinfoChanged')) {
        const split1 = line[0].split('n\\');
        const split2 = split1[1].split('\\t');
        const playerName = split2[0];
        if (!match[`game_${count}`].players.includes(playerName)) {
          match[`game_${count}`].players.push(playerName);
          match[`game_${count}`].kills[playerName] = 0;
        }
      }

      if (line[0].includes('Kill')) {
        const split1 = line[0].split(':');
        const split2 = split1[3].split('by');
        // const death_cause = split2[1];
        const split3 = split2[0].split('killed');
        const killer = split3[0].trim();
        const deadPlayer = split3[1].trim();
        Object.keys(match[`game_${count}`].kills).forEach((key, index) => {
          if (killer === '<world>' && deadPlayer === key) {
            match[`game_${count}`].total_kills += 1;
            match[`game_${count}`].kills[deadPlayer] -= 1;
          }
          if (key === killer) {
            match[`game_${count}`].total_kills += 1;
            match[`game_${count}`].kills[key] += 1;
          }
        })
      }
    })
  }
  getMatchData();
  console.log(match);
  return (
    <div>
      <h3>Hello, world!</h3>
      <ul>
        <li>Informações gerais de cada partida</li>
        <li>Causa das mortes por partida</li>
      </ul>
    </div>
  );
}

export default App;
