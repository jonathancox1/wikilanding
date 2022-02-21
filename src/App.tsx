import React from "react";
import "./App.css";
import "./assets/style.css";
import { Search } from "./Search";

function App() {
  return (
    <div className="App">
      <div className="heading">
        <h1>wiki</h1>
        <Search />
      </div>
      <hr />
    </div>
  );
}

export default App;
