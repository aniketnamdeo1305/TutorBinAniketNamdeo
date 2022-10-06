const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('Database Connection Successful!') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./user.model');
require('./todo.model');