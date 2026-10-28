
import React from "react";
import axios from "axios";
import "./App.scss";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
    };
  }

  componentDidMount() {
    this.loadTodos();
  }

  loadTodos = () => {
    axios
      .get("/api")
      .then((response) => {
        this.setState({
          todos: response.data.data,
        });
      })
      .catch((e) => console.log("Error loading Todos:", e));
  };

  handleAddTodo = (value) => {
    axios
      .post("/api/todos", { text: value })
      .then((response) => {
        this.setState((prevState) => ({
          todos: [...prevState.todos, response.data.data],
        }));
      })
      .catch((e) => console.log("Error adding Todo:", e));
  };

  handleDeleteTodo = (id) => {
    axios
      .delete(`/api/todos/${id}`)
      .then(() => {
        this.setState((prevState) => ({
          todos: prevState.todos.filter((todo) => todo._id !== id),
        }));
      })
      .catch((e) => console.log("Error deleting Todo:", e));
  };

  render() {
    return (
      <div className="App container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
              <h1>Todos</h1>
              <div className="todo-app">
                <AddTodo handleAddTodo={this.handleAddTodo} />
                <TodoList
                  todos={this.state.todos}
                  handleDeleteTodo={this.handleDeleteTodo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
