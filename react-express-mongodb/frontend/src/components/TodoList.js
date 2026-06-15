import React, { useState } from "react";

const TodoList = (props) => {
  const { todos } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return todos.length > 0 ? (
    <ul className="list-group">
      {todos.map((todo, index) => (
        <li
          className={
            "list-group-item cursor-pointer " +
            (index === activeIndex ? "active" : "")
          }
          key={todo._id} // todos queried from the database have an _id value that is better used here than index
          onClick={() => {
            setActiveIndex(index);
          }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  ) : (
    <div className="alert alert-primary" role="alert">
      No Todos to display
    </div>
  );
};

export default TodoList;
