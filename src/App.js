import qgame from './qgames.log';

function App() {
  const readLogFile = async () => {
    const res = await fetch(qgame);
    const reader = res.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const text = await decoder.decode(result.value);
    console.log(text);
  }
  readLogFile();

  return (
    <div>
      <h3>Hello, world!</h3>
    </div>
  );
}

export default App;
