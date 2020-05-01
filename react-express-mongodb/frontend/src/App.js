import React from 'react';
import {request} from './utilities/httpRequestHandler'
import './App.scss';
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      todos: []
    }
  }

  componentDidMount() {
      request('get','/api')
          .then((response) => {
              this.setState({
                  todos: response.data.data
              })
          }).catch((e) => console.log('Error : ', e))
  }

    _handleAddTodo = (value) => {
      request('post', '/api/todos', {text:value})
          .then((response) => {
              let todosCopy = this.state.todos;
              todosCopy.unshift({text:value});
              this.setState({
                  todos : todosCopy
              });
              this.refs.todo.value = ""
          }).catch((e) => console.log('Error : ', e));
    };


  render() {
    return (
        <div className="App container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
                <h1>Todos</h1>
                  <div className="todo-app">
                      <AddTodo handleAddTodo={(value) => {this._handleAddTodo(value)}}/>
                      <TodoList todos={this.state.todos}/>
                  </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
