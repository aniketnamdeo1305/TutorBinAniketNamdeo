const express = require('express');
const cors = require('cors');

require('./models/index');
const routes = require('./routes/index');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(2468, () => {
    console.log('Server Started on 2468');
})