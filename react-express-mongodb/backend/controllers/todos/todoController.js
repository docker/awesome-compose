const serverResponses = require("../../utils/helpers/responses");
const messages = require("../../config/messages");
const { Todo } = require("../../models/todos/todo");

const createTodo = async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  try {
    const result = await todo.save();
    serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
  } catch (error) {
    serverResponses.sendError(res, messages.BAD_REQUEST, error);
  }
};

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({}, { __v: 0 });
    serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
  } catch (error) {
    serverResponses.sendError(res, messages.BAD_REQUEST, error);
  }
};

module.exports = { createTodo, getAllTodos };
