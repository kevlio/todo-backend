const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 5000;

let todos;

fs.readFile("todos.json", "utf8", (err, data) => {
  if (err) throw err;

  const json = data;
  const parsedData = JSON.parse(json);
  todos = parsedData;
});

// DRY THIS CODE. EX. WRITEFILE ETC

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  const items = req.url.split("/");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    res.end();
  }

  // GET ALL
  // Hur felhantera denna?
  if (req.url === "/todos") {
    if (req.method === "GET") {
      console.log("GET");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
    }
  }

  // POST
  if (req.url === "/todos") {
    if (req.method === "POST") {
      console.log("POST");
      req.on("data", (chunk) => {
        const newTodo = JSON.parse(chunk);
        const newTodoKeys = Object.keys(newTodo);
        const checkTodoKeys = [
          "id",
          "todo",
          "date",
          "time",
          "prio",
          "completed",
        ];

        if (
          newTodoKeys.every((item) => checkTodoKeys.includes(item)) &&
          checkTodoKeys.every((item) => newTodoKeys.includes(item))
        ) {
          if (typeof newTodo.id === "number") {
            console.log("POST Object OK");
          } else {
            res.statusCode = 422;
            res.end();
            return;
          }
        } else {
          res.statusCode = 400;
          res.end();
          return;
        }

        todos.todos.push(newTodo);
        const stringifiedTodos = JSON.stringify(todos, null, "\t");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.statusCode = 201;
        res.end();
        fs.writeFile("todos.json", stringifiedTodos, (err) => {
          if (err) throw err;
          console.log("Added todo");
        });
      });
    }
  }

  // LOOK UP BY ID
  if (items[2]) {
    const todoID = parseInt(items[2]);
    const findTodoByID = todos.todos.find((todo) => todo.id === todoID);
    if (!findTodoByID) {
      res.statusCode = 404;
      res.end();
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
      const filterByID = todos.todos.filter((todo) => todo.id !== todoID);
      todos.todos = filterByID;
      const updatedTodos = JSON.stringify(todos, null, "\t");
      res.statusCode = 200;
      res.end();

      fs.writeFile("todos.json", updatedTodos, (err) => {
        if (err) throw err;
        console.log(`Updated todos, deleted Todo with ID: ${todoID}`);
      });
    }

    // PUT
    if (req.method === "PUT") {
      console.log("PUT");
      console.log(todoID);
      req.on("data", (chunk) => {
        const updatedTodo = JSON.parse(chunk);
        console.log(updatedTodo);
        const todoIndex = todos.todos.findIndex((todo) => todo.id === todoID);
        todos.todos[todoIndex] = updatedTodo;
        const updatedTodos = JSON.stringify(todos, null, "\t");
        res.statusCode = 200;
        res.end();
        fs.writeFile("todos.json", updatedTodos, (err) => {
          if (err) throw err;
          console.log(`Updated todos, updated Todo with ID: ${todoID}`);
        });
      });
    }

    // PATCH
    if (req.method === "PATCH") {
      console.log("PATCH");
      console.log(todoID);
      req.on("data", (chunk) => {
        const updatedTodo = JSON.parse(chunk);
        console.log(updatedTodo);
        const todoIndex = todos.todos.findIndex((todo) => todo.id === todoID);
        todos.todos[todoIndex].completed = updatedTodo;
        console.log(todos.todos[todoIndex]);
        const updatedTodos = JSON.stringify(todos, null, "\t");
        res.statusCode = 200;
        res.end();
        fs.writeFile("todos.json", updatedTodos, (err) => {
          if (err) throw err;
          console.log(
            `Updated todos, partially updated Todo with ID: ${todoID}`
          );
        });
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});
