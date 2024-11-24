const express = require("express");
const app = express();
app.use(express.json());


let users = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Doe", age: 25 },
  { id: 3, name: "Bob Smith", age: 40 },
];


app.get("/users", (req, res) => {
  res.json(users);
});


app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.json(newUser);
});


app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    res.status(404).json({ message: "User  not found" });
  } else {
    res.json(user);
  }
});


app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    res.status(404).json({ message: "User  not found" });
  } else {
    user.name = req.body.name;
    user.age = req.body.age;
    res.json(user);
  }
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users.findIndex((user) => user.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ message: "User  not found" });
  } else {
    users.splice(index, 1);
    res.json({ message: "User  deleted successfully" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});