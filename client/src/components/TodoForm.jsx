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
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";

import { AiFillCheckCircle, AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { GiCapybara } from "react-icons/gi";

function TodoForm() {
  // Localstorage if backendRequest fails
  const initialState = JSON.parse(localStorage.getItem("todos")) || [];
  const [todos, setTodos] = useState(initialState);
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  });

  // Todo input
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prio, setPrio] = useState("");
  const [completed, setCompleted] = useState(false);

  // Edit mode
  const [editID, setEditID] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editComplete, setEditComplete] = useState(false);

  // Request Panel
  const [backendRequest, setBackendRequest] = useState(["", ""]);
  const [reqURL, setReqURL] = useState("");
  const [response, setResponse] = useState(["", "", "", ""]);

  // Filters
  const [filters, setFilters] = useState([]);
  const [prioFilters, setPrioFilters] = useState("");
  const [dateFilters, setDateFilters] = useState("dateAsc");
  const [filteredTodos, setFilteredTodos] = useState([]);

  // Get all todos
  const getTodos = () => {
    const url = "http://localhost:5000/todos";
    axios
      .get(url)
      .then((response) => {
        setTodos(response.data);
        setFilteredTodos(response.data.todos);
      })
      .catch(function (error) {
        console.error(error);
        setGetResponse(error);
      });
    setBackendRequest(["", "white"]);
    setResponse(["", "", "", ""]);
    setResponse(["", "", ""]);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // POST
  const addTodo = () => {
    setFilteredTodos(todos.todos);
    const newTodo = {
      id: Math.floor(Math.random() * 10000),
      todo: todo,
      date: date,
      time: time,
      prio: prio,
      completed: false,
    };

    const url = "http://localhost:5000/todos";
    setReqURL(url);

    axios
      .post(url, newTodo)
      .then(function (response) {
        console.log(response);
        getTodos();
        reset();
        setBackendRequest(["POST", "blue.400"]);
        setResponse([response.status, response.statusText, response.data]);
      })
      .catch(function (error) {
        console.error(error);
        setResponse([error.response.status, error.response.statusText]);
      });
  };

  // DELETE
  const deleteTodo = (id) => {
    setFilteredTodos(todos.todos);

    const url = `http://localhost:5000/todos/${id}`;
    setReqURL(url);

    axios
      .delete(url)
      .then(function (response) {
        console.log(response);
        getTodos();
        setBackendRequest(["DELETE", "red"]);
        setResponse([response.status, response.statusText, response.data]);
      })
      .catch(function (error) {
        console.error(error);
        setResponse([error.response.status, error.response.statusText]);
      });
  };

  // PUT
  const editTodo = (id) => {
    setFilteredTodos(todos.todos);
    setBackendRequest(["", "white"]);
    setResponse(["", "", "", ""]);

    if (!editComplete) {
      setEditMode(true);
      const todo = todos.todos.filter((todo) => {
        return todo.id === id;
      });
      setTodo(todo[0].todo);
      setPrio(todo[0].prio);
      setDate(todo[0].date);
      setTime(todo[0].time);
      setEditID(todo[0].id);
      setCompleted(todo[0].completed);

      setEditComplete(true);

      const url = `http://localhost:5000/todos/${todo[0].id}`;
      setReqURL(url);
    }

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
          completed: completed,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response);
          getTodos();
          setEditMode(false);
          setEditComplete(false);
          reset();
          setBackendRequest(["PUT", "purple.400"]);
          setResponse([response.status, response.statusText, response.data]);
        })
        .catch(function (error) {
          console.error(error);
          setResponse([error.response.status, error.response.statusText]);
        });
    }
  };

  // PATCH
  const completeTodo = (id) => {
    setFilteredTodos(todos.todos);
    const filterByID = todos.todos.filter((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        return todo;
      }
    });

    console.log(filterByID[0].completed);
    console.log(typeof filterByID[0].completed);

    const url = `http://localhost:5000/todos/${id}`;
    setReqURL(url);

    const options = {
      method: "PATCH",
      url: url,
      headers: { "Content-Type": "application/json" },
      data: filterByID[0].completed,
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        getTodos();
        setBackendRequest(["PATCH", "pink.400"]);
        setResponse([response.status, response.statusText, response.data]);
      })
      .catch(function (error) {
        console.error(error);
        setResponse([error.response.status, error.response.statusText]);
      });
  };

  // Reset
  const reset = () => {
    setTodo("");
    setPrio("");
    setDate("");
    setTime("");
    setEditID("");
  };

  // Fancy UI
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

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

  // Filter by Completion
  const handleCheck = (event) => {
    const name = event.target.name;
    if (!filters.includes(name)) {
      setFilters([...filters, name]);
    }
    if (filters.includes(name)) {
      setFilters(filters.filter((f) => f !== name));
    }
  };
  useEffect(() => {
    if (filters.includes("completed")) {
      setFilteredTodos(todos.todos.filter((todo) => todo.completed === true));
    }
    if (filters.includes("uncompleted")) {
      setFilteredTodos(todos.todos.filter((todo) => todo.completed === false));
    }
    if (filters.length === 0 || filters.length === 2) {
      setFilteredTodos(todos.todos);
    }
  }, [filters, todos]);

  // Filter by Prio
  useEffect(() => {
    if (prioFilters.length > 0) {
      setFilteredTodos(todos.todos.filter((todo) => todo.prio === prioFilters));
    }

    if (prioFilters.length === 0) {
      setFilteredTodos(todos.todos);
    }
  }, [prioFilters, todos]);

  // Filter by Date
  useEffect(() => {
    const sortDate = todos.todos.sort(function (a, b) {
      if (dateFilters === "dateAsc") {
        return Date.parse(b.date) - Date.parse(a.date);
      }
      if (dateFilters === "dateDesc") {
        return Date.parse(a.date) - Date.parse(b.date);
      }
    });
    setFilteredTodos(sortDate);
  }, [dateFilters, todos]);

  return (
    <Center mt={4}>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
          justifyContent="center"
        >
          <Text fontSize="1xl">KK1 By Kevlio </Text>
          <GiCapybara size={15} />
          <GiCapybara size={20} />
          <GiCapybara size={30} color="gold" />
          <GiCapybara size={20} />
          <GiCapybara size={15} />
        </Box>
        <Box>
          <Box
            fontFamily="Consolas"
            backgroundColor="black"
            color={backendRequest[1]}
            p={2}
            my={2}
          >
            <Text>Request mode: {backendRequest[0]}</Text>
            <Text>URL: {reqURL}</Text>
            <Text>
              Status code: {response[0]} {response[1]}
            </Text>
          </Box>
        </Box>
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
              value={(editMode && todo) || (todo && todo)}
            ></Input>
            <Stack spacing={3}>
              <Select
                value={(editMode && prio) || (prio && prio)}
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
                value={(editMode && date) || (date && date)}
                onChange={(e) => setDate(e.target.value)}
              ></Input>
              <Input
                width="40%"
                name="time"
                type="time"
                value={(editMode && time) || (time && time)}
                onChange={(e) => setTime(e.target.value)}
              ></Input>
            </Box>
            <Button
              width="100%"
              onClick={() => {
                if (!editMode) {
                  addTodo();
                  handleField();
                  reset();
                }
                if (editMode) {
                  editTodo();
                  handleField();
                  reset();
                }
              }}
              colorScheme={editMode ? "blue" : "green"}
            >
              {editMode ? "Edit todo" : "Save todo"}
            </Button>
          </form>
        </Collapse>
        <CheckboxGroup colorScheme="green">
          <Stack
            my={2}
            spacing={[1, 5]}
            direction={["column", "row"]}
            color="gray.500"
            justifyContent="center"
          >
            <Checkbox
              name="completed"
              onChange={handleCheck}
              isChecked={filters.includes("completed")}
            >
              Completed
            </Checkbox>
            <Checkbox
              name="uncompleted"
              onChange={handleCheck}
              isChecked={filters.includes("uncompleted")}
            >
              Uncompleted
            </Checkbox>
          </Stack>
        </CheckboxGroup>
        <Stack spacing={3}>
          <Select
            variant="outline"
            placeholder="Filter by Priority"
            onChange={(e) => setPrioFilters(e.target.value)}
          >
            <option value="high">High</option>
            <option value="mid">Mid</option>
            <option value="low">Low</option>
          </Select>
        </Stack>
        <CheckboxGroup colorScheme="green">
          <Stack
            my={2}
            spacing={[1, 5]}
            direction={["column", "row"]}
            color="gray.500"
            justifyContent="center"
          >
            {/* <Text>Sort by status</Text> */}
            <Checkbox
              name="dateAsc"
              onChange={(e) => setDateFilters(e.target.name)}
              isChecked={dateFilters.includes("dateAsc")}
            >
              Date Asc.
            </Checkbox>
            <Checkbox
              name="dateDesc"
              onChange={(e) => setDateFilters(e.target.name)}
              isChecked={dateFilters.includes("dateDesc")}
            >
              Date Desc.
            </Checkbox>
          </Stack>
        </CheckboxGroup>
        <Box>
          {filteredTodos &&
            filteredTodos.map((todo) => (
              <Box
                minW="300px"
                maxW="375px"
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
                  todo.completed === false ? "gray.50" : "green.400"
                }
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Text wordBreak="break-word">{todo.todo}</Text>
                  </Box>
                  <Text
                    textTransform="capitalize"
                    color={
                      (todo.prio === "high" && "red") ||
                      (todo.prio === "mid" && "blue") ||
                      (todo.prio === "low" && "green")
                    }
                  >
                    Prio: {todo.prio}
                  </Text>
                  <Text>
                    {todo.date} - {todo.time}
                  </Text>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Box display="flex" flexDirection="row" gap={2} ml={2}>
                    <AiFillDelete
                      color="red"
                      onClick={() => deleteTodo(todo.id)}
                      size={20}
                    />
                    <AiTwotoneEdit
                      color="blue"
                      onClick={() => editTodo(todo.id)}
                      size={20}
                    />
                    <AiFillCheckCircle
                      color="green"
                      onClick={() => completeTodo(todo.id)}
                      size={20}
                    />
                  </Box>
                  <Text>ID: {todo.id}</Text>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Center>
  );
}

export default TodoForm;
