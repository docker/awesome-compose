
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
              "list-group-item d-flex justify-content-between align-items-center " +
              (i === this.state.activeIndex ? "active" : "")
            }
            key={todo._id || i}
            onClick={() => this.handleActive(i)}
          >
            <span>{todo.text}</span>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={(event) => {
                event.stopPropagation();
                this.props.handleDeleteTodo(todo._id);
              }}
              disabled={!todo._id}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { todos } = this.props;

    return todos.length > 0 ? (
      this.renderTodos(todos)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Todos to display
      </div>
    );
  }
}

