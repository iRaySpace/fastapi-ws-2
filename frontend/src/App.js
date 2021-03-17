import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [webSocket, setWebSocket] = useState(null);
  const [ping, setPing] = useState(null);
  const { addToast } = useToasts();

  function _onMessage(ev) {
    addToast(ev.data, { appearance: "info" });
  }

  function _handleConnect() {
    addToast("Connecting", { appearance: "info" });
    const ws = new WebSocket("ws://localhost:8000/ws/Administrator");
    ws.onmessage = _onMessage;
    setWebSocket(ws);
    setPing(setInterval(() => ws.send("ping"), 3000));
  }

  function _handleDisconnect() {
    webSocket.close();
    clearInterval(ping);
    setWebSocket(null);
    setPing(null);
    addToast("Disconnected", { appearance: "warning" });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <button onClick={_handleConnect}>Connect</button>
          <button onClick={_handleDisconnect}>Disconnect</button>
        </div>
      </header>
    </div>
  );
}

export default App;
