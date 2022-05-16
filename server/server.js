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

const server = http.createServer((req, res) => {
  // GET
  if (req.url === "/todos") {
    if (req.method === "GET") {
      res.setHeader("Access-Control-Allow-Origin", "*");
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
        todos.todos.push(newTodo);
        const stringifiedTodos = JSON.stringify(todos, null, "\t");
        res.statusCode = 200;
        res.end();
        fs.writeFile("todos.json", stringifiedTodos, (err) => {
          if (err) throw err;
          console.log("Added todo");
        });
      });
    }
  }
  // DELETE
  // PUT
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
