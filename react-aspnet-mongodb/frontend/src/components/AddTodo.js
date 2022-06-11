import React from "react";

export default class AddTodo extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target.elements.value;
    if (value.length > 0) {
      this.props.handleAddTodo(value);
      e.target.reset();
    }
  };

  render() {
    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className="new-todo form-group"
      >
        <input
          type="text"
          name="value"
          required
          minLength={1}
          className="form-control"
        />
        <button className="btn btn-primary" type="submit">
          Add Todo
        </button>
      </form>
    );
  }
}
