const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User'
    },
    task: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;

