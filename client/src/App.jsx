import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import TodoForm from "./components/TodoForm";

function App() {
  return (
    <div className="App">
      <TodoForm />
    </div>
  );
}

export default App;
