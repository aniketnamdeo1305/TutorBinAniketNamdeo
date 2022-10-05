const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tutorbin-assignment', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('Database Connection Successful!') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./user.model');
require('./todo.model');