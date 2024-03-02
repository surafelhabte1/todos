const mongoose = require("mongoose");

const Task = new mongoose.Schema({
  title: String,
  description: String,
  isDone: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const task = (module.exports = mongoose.model("task", Task));

module.exports = {
  task,
};
