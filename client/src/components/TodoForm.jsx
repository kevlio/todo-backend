import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";

import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import { GiCapybara } from "react-icons/gi";

function TodoForm() {
  const [todos, setTodos] = useState([]);

  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [prio, setPrio] = useState("");

  const getTodos = () => {
    console.log("Get todos");
    axios.get("http://192.168.10.184:5000/todos", {}).then((response) => {
      setTodos(response.data);
      console.log(todos);
    });
  };

  const addTodo = () => {
    const newTodo = {
      // Testade att byta till sträng
      id: Math.floor(Math.random() * 10000).toString(),
      todo: todo,
      date: date,
      time: time,
      prio: prio,
      // Testade att byta till sträng
      completed: "false",
    };

    console.log(newTodo);

    const options = {
      method: "POST",
      url: "http://localhost:5000/todos",
      headers: { "Content-Type": "application/json" },
      data: newTodo,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const deleteTodo = (id) => {
    console.log("delete");
    console.log(id);
  };
  const editTodo = () => {};

  return (
    <Center mt={4}>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="2xl">Kunskapskontroll 1 </Text>
          <GiCapybara size={15} />
          <GiCapybara size={20} />
          <GiCapybara size={30} color="gold" />
          <GiCapybara size={20} />
          <GiCapybara size={15} />
        </Box>
        <Input
          isRequired
          name="todo"
          placeholder="Add to-do"
          onChange={(e) => setTodo(e.target.value)}
        ></Input>
        <Stack spacing={3}>
          <Select
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
            width="60%"
            isRequired
            name="date"
            type="date"
            onChange={(e) => setDate(e.target.value)}
          ></Input>
          <Input
            width="40%"
            isRequired
            name="time"
            type="time"
            onChange={(e) => setTime(e.target.value)}
          ></Input>
        </Box>
        <Button onClick={getTodos} colorScheme="blue">
          Get todos
        </Button>
        <Button onClick={addTodo} colorScheme="green">
          Add todo
        </Button>
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
              >
                <Box display="flex" flexDirection="row" gap={2}>
                  <Text>{todo.id}</Text>
                  <Text>{todo.todo}</Text>
                  <Text>{todo.date}</Text>
                  <Text>{todo.prio}</Text>
                  <Text>{todo.completed}</Text>
                </Box>
                <Box display="flex" flexDirection="row">
                  <AiFillDelete
                    color="red"
                    onClick={() => deleteTodo(todo.id)}
                  />
                  <AiFillCheckCircle color="green" />
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Center>
  );
}

export default TodoForm;
