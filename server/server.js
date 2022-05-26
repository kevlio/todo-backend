const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 5000;

const { writeFile, idCheck, keyCheck, dataCheck } = require("./functions");

let todos;

fs.readFile("todos.json", "utf8", (err, data) => {
  if (err) throw err;
  const json = data;
  const parsedData = JSON.parse(json);
  todos = parsedData;
});

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  const path = req.url.split("/");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    res.end();
  }

  // GET ALL
  if (req.method === "GET") {
    if (req.url === "/todos") {
      console.log("GET");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
    } else {
      if (path.length === 2 || req.url === "/todos/") {
        res.statusCode = 404;
        res.end(
          "Wrong path, to GET all items use URL: http://localhost:5000/todos"
        );
      }
    }
  }

  // POST
  if (req.url === "/todos") {
    if (req.method === "POST") {
      console.log("POST");
      req.on("data", (chunk) => {
        const newTodo = JSON.parse(chunk);
        const newTodoKeys = Object.keys(newTodo);

        const { idExist } = idCheck(todos.todos, newTodo.id);
        const { keysExist } = keyCheck(newTodoKeys);
        const { dataType } = dataCheck(newTodo);

        if (keysExist) {
          if (!idExist && dataType) {
            console.log("POST Object OK");
          } else {
            res.statusCode = 422;
            if (idExist && !dataType) {
              res.end(`ID already exists and object datatype error`);
              return;
            } else if (idExist && dataType) {
              res.end(`ID already exists`);
              return;
            } else if (!dataType) {
              res.end(`Object datatype error`);
              return;
            }
          }
        } else {
          res.statusCode = 400;
          res.end(`Object keys missing`);
          return;
        }

        todos.todos.push(newTodo);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.statusCode = 201;
        res.end(JSON.stringify(newTodo));
        writeFile(todos, "POST", newTodo.id);
      });
    }
  }

  // LOOK UP BY ID (FIRST CHECK: GET/ID, DELETE, PUT, PATCH)
  if (path[2]) {
    const todoID = parseInt(path[2]);
    const { idExist } = idCheck(todos.todos, todoID);

    if (!idExist) {
      res.statusCode = 404;
      res.end(
        "ID doesn't exist. Send a get request to http://localhost:5000/todo to see available items."
      );
      return;
    }

    // GET
    if (req.method === "GET") {
      const filterByID = todos.todos.filter((todo) => todo.id === todoID);
      res.statusCode = 200;
      res.end(JSON.stringify(filterByID));
    }

    // DELETE
    if (req.method === "DELETE") {
      console.log("DELETE");
      console.log(todoID);
      const filterByID = todos.todos.filter((todo) => todo.id !== todoID);
      const deletedByID = todos.todos.filter((todo) => todo.id === todoID);
      todos.todos = filterByID;
      res.statusCode = 200;
      res.end(JSON.stringify(deletedByID[0]));
      writeFile(todos, "DELETE", todoID);
    }

    // PUT
    if (req.method === "PUT") {
      console.log("PUT");
      console.log(todoID);
      req.on("data", (chunk) => {
        const updatedTodo = JSON.parse(chunk);
        const updatedTodoKeys = Object.keys(updatedTodo);
        console.log(updatedTodo);

        const { keysExist } = keyCheck(updatedTodoKeys);
        const { dataType } = dataCheck(updatedTodo);

        if (keysExist && dataType) {
          console.log("PUT Object OK");
        } else if (!keysExist) {
          res.statusCode = 400;
          res.end(`Object keys missing`);
          return;
        } else if (!dataType) {
          res.statusCode = 422;
          res.end(`Object datatype error`);
          return;
        }
        const todoIndex = todos.todos.findIndex((todo) => todo.id === todoID);
        todos.todos[todoIndex] = updatedTodo;
        res.statusCode = 200;
        res.end(JSON.stringify(updatedTodo));
        writeFile(todos, "PUT", todoID);
      });
    }

    // PATCH
    if (req.method === "PATCH") {
      console.log("PATCH");
      console.log(todoID);
      req.on("data", (chunk) => {
        const updateComplete = JSON.parse(chunk);

        if (typeof updateComplete !== "boolean") {
          res.statusCode = 422;
          res.end();
          return;
        }

        const todoIndex = todos.todos.findIndex((todo) => todo.id === todoID);
        todos.todos[todoIndex].completed = updateComplete;
        console.log(todos.todos[todoIndex]);
        res.statusCode = 200;
        res.end(JSON.stringify(todos.todos[todoIndex]));
        writeFile(todos, "PATCH", todoID);
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});
