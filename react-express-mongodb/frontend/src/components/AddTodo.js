import React from "react";

const AddTodo = (props) => {
  const { todos, setTodos } = props;

  async function handleSubmit(e) {
    e.preventDefault();
    const { value } = e.target.elements.value;
    if (value.length > 0) {
      try {
        const newTodoResponse = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: value }),
        });

        if (!newTodoResponse.ok) {
          console.log("Fetch failed");
        } else {
          const newTodo = await newTodoResponse.json();
          setTodos([...todos, newTodo.data]);
          e.target.reset();
        }
      } catch (error) {
        console.log("Error :", error);
      }
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => handleSubmit(e)}
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
};

export default AddTodo;
