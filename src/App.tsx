import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="heading">Wiki</div>
      <label htmlFor="search">
        <input id="search" />
        <button type="submit">Search</button>
      </label>
    </div>
  );
}

export default App;
