import React, { useState, useEffect } from "react";
import "./App.scss";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

const MainApp = () => {
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    try {
      const todoListResponse = await fetch("/api", {
        method: "GET",
      });

      if (!todoListResponse.ok) {
        console.log("Fetch failed");
      } else {
        const updatedTodos = await todoListResponse.json();
        setTodos([...updatedTodos.data]);
      }
    } catch (error) {
      console.log("Error :", error);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
            <h1>Todos</h1>
            <div className="todo-app">
              <AddTodo todos={todos} setTodos={setTodos} />
              <TodoList todos={todos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
