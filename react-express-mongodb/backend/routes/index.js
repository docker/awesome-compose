const express = require("express");
const todoController = require("../controllers/todos/todoController");

const routes = (app) => {
  const router = express.Router();

  router.post("/todos", todoController.createTodo);

  router.get("/", todoController.getAllTodos);

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
