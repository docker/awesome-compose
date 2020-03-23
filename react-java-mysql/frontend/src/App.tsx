import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

type Greeting = {
  id: number;
  name: string;
};

function App() {
  const [greeting, setGreeting] = useState<Greeting>();
  useEffect(() => {
    fetch("/api")
      .then(res => res.json())
      .then(setGreeting)
      .catch(console.error);
  }, [setGreeting]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {greeting ? (
          <p>Hello from {greeting.name}</p>
        ) : (
          <p>Loading...</p>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
