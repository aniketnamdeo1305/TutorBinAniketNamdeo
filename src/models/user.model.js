const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
});

mongoose.model('User', userSchema);