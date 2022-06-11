import React from "react";

export default class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  handleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  renderTodos(todos) {
    return (
      <ul className="list-group">
        {todos.map((todo, i) => (
          <li
            className={
              "list-group-item cursor-pointer " +
              (i === this.state.activeIndex ? "active" : "")
            }
            key={i}
            onClick={() => {
              this.handleActive(i);
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    let { todos } = this.props;
    return todos.length > 0 ? (
      this.renderTodos(todos)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Todos to display
      </div>
    );
  }
}
