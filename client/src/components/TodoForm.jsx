import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Center,
  Select,
  Box,
  Stack,
  Text,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";

import { AiFillCheckCircle, AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { GiCapybara } from "react-icons/gi";

function TodoForm() {
  const initialState = JSON.parse(localStorage.getItem("todos")) || [];
  const [todos, setTodos] = useState(initialState);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  });

  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prio, setPrio] = useState("");
  const [completed, setCompleted] = useState(false);

  const [editID, setEditID] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editComplete, setEditComplete] = useState(false);

  const [backend, setBackend] = useState("");

  function handleSubmit(event) {
    // event.preventDefault();
  }
  const todoRef = useRef();
  function handleField() {
    todoRef.current.value = null;
  }

  const showForm = () => {
    onToggle();
  };

  const getTodos = () => {
    setBackend("GET");
    console.log("Get todos");
    axios.get("http://192.168.10.184:5000/todos").then((response) => {
      setTodos(response.data);
      console.log(todos);
    });
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = () => {
    setBackend("POST");
    const newTodo = {
      id: Math.floor(Math.random() * 10000).toString(),
      todo: todo,
      date: date,
      time: time,
      prio: prio,
      completed: completed.toString(),
    };

    axios
      .post("http://localhost:5000/todos", newTodo)
      .then(function (response) {
        console.log(response.data);
        console.log(response.status);
        // Unnecessary nesting in todos.json
        // Fun for challenge
        const todoArray = todos.todos;
        todoArray.push(newTodo);
        const todoObject = {
          todos: [...todoArray],
        };
        setTodos(todoObject);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const deleteTodo = (id) => {
    setBackend("DELETE");
    console.log("delete");
    console.log(id);

    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(function (response) {
        console.log(response.data);
        setTodos({
          todos: todos.todos.filter((todo) => {
            return todo.id !== id;
          }),
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const editTodo = (id) => {
    setBackend("PUT");
    if (!editComplete) {
      setEditMode(true);
      const todo = todos.todos.filter((todo) => {
        return todo.id === id;
      });
      console.log(todo);
      setTodo(todo[0].todo);
      setPrio(todo[0].prio);
      setDate(todo[0].date);
      setTime(todo[0].time);
      setEditID(todo[0].id);
      setCompleted(todo[0].completed);
      setEditComplete(true);
    }

    // TEST
    if (editComplete) {
      const options = {
        method: "PUT",
        url: `http://localhost:5000/todos/${editID}`,
        headers: { "Content-Type": "application/json" },
        data: {
          id: editID,
          todo: todo,
          date: date,
          time: time,
          prio: prio,
          completed: completed.toString(),
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          // Reset
          setTodo("");
          setPrio("");
          setDate("");
          setTime("");
          setEditID("");
          setCompleted("false");
          setEditMode(false);
          // Update todos/alt fetcha
          getTodos();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const completeTodo = (id) => {
    setBackend("PATCH");
    const options = {
      method: "PATCH",
      url: `http://localhost:5000/todos/${id}`,
      headers: { "Content-Type": "application/json" },
      data: {
        id: "PATCH",
        todo: "PATCH",
        date: "PATCH",
        time: "PATCH",
        prio: "PATCH",
        completed: "PATCH",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    console.log(id);
    setCompleted(!completed);
    console.log(completed);
    console.log(completed.toString());
  };

  return (
    <Center mt={4}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text fontSize="2xl">Kunskapskontroll 1 </Text>
          <GiCapybara size={15} />
          <GiCapybara size={20} />
          <GiCapybara size={30} color="gold" />
          <GiCapybara size={20} />
          <GiCapybara size={15} />
        </Box>
        <Text fontSize="2xl">Request: {backend}</Text>
        <Button
          onClick={showForm}
          color="white"
          backgroundColor={isOpen ? "red.400" : "green.400"}
        >
          {isOpen ? "Hide form" : "Show form"}
        </Button>
        <Collapse in={isOpen}>
          <form onSubmit={() => handleSubmit()}>
            <Input
              ref={todoRef}
              isRequired
              name="todo"
              placeholder="Add to-do"
              onChange={(e) => setTodo(e.target.value)}
              defaultValue={editMode ? todo : ""}
            ></Input>
            <Stack spacing={3}>
              <Select
                value={editMode ? prio : ""}
                variant="outline"
                placeholder="Select priority"
                onChange={(e) => setPrio(e.target.value)}
              >
                <option value="high">High</option>
                <option value="mid">Mid</option>
                <option value="low">Low</option>
              </Select>
            </Stack>
            <Box display="flex" flexDirection="row">
              <Input
                isRequired
                width="60%"
                name="date"
                type="date"
                // value={date}
                value={editMode ? date : ""}
                onChange={(e) => setDate(e.target.value)}
              ></Input>
              <Input
                width="40%"
                name="time"
                type="time"
                value={editMode ? time : ""}
                onChange={(e) => setTime(e.target.value)}
              ></Input>
            </Box>
            <Button
              width="100%"
              onClick={() => {
                if (!editMode) {
                  console.log("Add Todo");
                  addTodo();
                  handleField();
                }
                if (editMode) {
                  console.log("Submit Edit");
                  editTodo();
                  handleField();
                }
              }}
              colorScheme={editMode ? "blue" : "green"}
            >
              {editMode ? "Edit todo" : "Save todo"}
            </Button>
          </form>
        </Collapse>
        <Box>
          {todos.todos &&
            todos.todos.map((todo) => (
              <Box
                key={todo.id}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                border="1px solid black"
                p={1}
                my={0.5}
                borderRadius={8}
                color={todo.id === editID && "blue"}
                borderColor={todo.id === editID && "blue"}
                backgroundColor={
                  todo.completed === "false" ? "gray.50" : "green.400"
                }
              >
                <Box display="flex" flexDirection="row" gap={2}>
                  <Box>
                    <Text>ID: {todo.id}</Text>
                    <Text>{todo.todo}</Text>
                  </Box>
                  <Box>
                    <Text>Date: {todo.date}</Text>
                    <Text>Time: {todo.time}</Text>
                  </Box>
                  <Box>
                    <Text>Prio: {todo.prio}</Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row">
                  <AiFillDelete
                    color="red"
                    onClick={() => deleteTodo(todo.id)}
                    size={20}
                  />
                  <AiFillCheckCircle
                    color="green"
                    onClick={() => completeTodo(todo.id)}
                    size={20}
                  />
                  <AiTwotoneEdit
                    color="blue"
                    onClick={() => editTodo(todo.id)}
                    size={20}
                  />
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Center>
  );
}

export default TodoForm;
