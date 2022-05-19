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
  if (req.url === "/todos") {
    if (req.method === "GET") {
      console.log("GET");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
    }
  }

  // GET BY ID
  if (items[2]) {
    const todoID = items[2];
    if (req.method === "GET") {
      const filterByID = todos.todos.filter((todo) => todo.id === todoID);
      res.end(JSON.stringify(filterByID));
    }
    // DELETE
    if (req.method === "DELETE") {
      console.log("DELETE");
      const filterByID = todos.todos.filter((todo) => todo.id !== todoID);
      todos.todos = filterByID;
      const updatedTodos = JSON.stringify(todos, null, "\t");
      res.end();

      fs.writeFile("todos.json", updatedTodos, (err) => {
        if (err) throw err;
        console.log(`Updated todos, deleted Todo with ID: ${todoID}`);
      });
    }
    if (req.method === "PUT") {
      console.log("PUT");
      console.log(todoID);
      req.on("data", (chunk) => {
        const updatedTodo = JSON.parse(chunk);
        console.log(updatedTodo);
        const todoIndex = todos.todos.findIndex((todo) => todo.id === todoID);
        todos.todos[todoIndex] = updatedTodo;
        const updatedTodos = JSON.stringify(todos, null, "\t");
        res.end();
        fs.writeFile("todos.json", updatedTodos, (err) => {
          if (err) throw err;
          console.log(`Updated todos, updated Todo with ID: ${todoID}`);
        });
      });
    }

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

  // POST
  if (req.url === "/todos") {
    if (req.method === "POST") {
      console.log("POST");
      req.on("data", (chunk) => {
        const newTodo = JSON.parse(chunk);
        todos.todos.push(newTodo);
        const stringifiedTodos = JSON.stringify(todos, null, "\t");
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end();
        fs.writeFile("todos.json", stringifiedTodos, (err) => {
          if (err) throw err;
          console.log("Added todo");
        });
      });
    }
  }

  // PUT
  // PATCH (PARTIAL: BARA ÄNDRA KLAR/EJ KLAR)
});
server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});

// const headers = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
//   "Access-Control-Max-Age": 2592000, // 30 days
//   /** add other headers as per requirement */
// };
// res.setHeader("Access-Control-Allow-Origin", "*");
// res.setHeader("Access-Control-Allow-Credentials", "true");
// res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
// res.setHeader(
//   "Access-Control-Allow-Headers",
//   "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
// );
