const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.error(err));

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.listen(port, () => console.log(`Server listening on port ${port}`));

const { task } = require("./models");

// Get all todos
app.get("/getTodos", async (req, res) => {
  const tasks = await task.find().sort({ createdAt: 'desc' });
  res.json(tasks);
});

// Create a new task
app.post("/createTodo", async (req, res) => {
  const newTask = new task(req.body);
  await newTask
    .save()
    .then((response) => {
      res.status(200).json({ message: "Todo created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating todo" });
    });
});

app.post("/updateTodo", async (req, res) => {
  try {
    const { id, updates } = req.body;

    task
      .findByIdAndUpdate(id, updates)
      .then((response) => {
        res.status(200).json({ message: "Todo updated successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error updating Todo" });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task by ID
app.get("/deleteTodo/:id", async (req, res) => {
  try {
    task
      .deleteOne({ _id: req.params.id })
      .then((response) => {
        res.status(200).json({ message: "Todo deleted successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error deleting Todo" });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
