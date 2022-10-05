const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    task: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean
    }
});


mongoose.model('Todo', todoSchema);