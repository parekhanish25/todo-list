const mongoose = require('mongoose');

const Todolist = new mongoose.Schema({
    taskname: String,
    deadline: Date,
    completed: { type: Boolean, default: false },
});
const TodoSchema = mongoose.model('todolist', Todolist);
module.exports = { TodoSchema };