import { useState } from 'react';
import qgame from './qgames.log';
import Papa from 'papaparse';

function App() {
  const [gameData, setGameData] = useState();

  const readLogFile = async () => {
    const res = await fetch(qgame);
    const reader = res.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const text = await decoder.decode(result.value);

    Papa.parse(text, {
      complete: function(results) {
        console.log('teste', results);
        setGameData(results);
      }
    });
  }
  readLogFile();
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
