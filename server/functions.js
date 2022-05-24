const fs = require("fs");

// Write to JSON file
const writeFile = (todos, request, id) => {
  fs.writeFile("todos.json", JSON.stringify(todos, null, "\t"), (err) => {
    if (err) throw err;

    if (request === "POST")
      console.log(
        `Wrote to todos.json after successful  ${request} request, added Todo with ID: ${id}`
      );
    if (request === "DELETE")
      console.log(
        `Wrote to todos.json after successful ${request} request, deleted Todo with ID: ${id}`
      );
    if (request === "PUT")
      console.log(
        `Wrote to todos.json after successful ${request} request, updated Todo with ID: ${id}`
      );
    if (request === "PATCH")
      console.log(
        `Wrote to todos.json after successful ${request} request, partially updated Todo with ID: ${id}`
      );
  });
};

// REQUEST CONTROL
const idCheck = (todos, id) => {
  const idExist = todos.find((todo) => todo.id === id) ? true : false;
  return { idExist };
};

const keyCheck = (keys) => {
  const checkTodoKeys = ["id", "todo", "date", "time", "prio", "completed"];
  const keysExist =
    keys.every((item) => checkTodoKeys.includes(item)) &&
    checkTodoKeys.every((item) => keys.includes(item));
  return { keysExist };
};

const dataCheck = (todo) => {
  const dataType =
    typeof todo.id === "number" &&
    typeof todo.todo === "string" &&
    typeof todo.date === "string" &&
    typeof todo.time === "string" &&
    typeof todo.prio === "string" &&
    typeof todo.completed === "boolean";
  return { dataType };
};

module.exports = {
  writeFile,
  idCheck,
  keyCheck,
  dataCheck,
};
