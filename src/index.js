const express = require('express');
const cors = require('cors');
require("dotenv").config();

require('./models/index');
const routes = require('./routes/index');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(process.env.PORT, () => {
    console.log(`Server Started on ${process.env.PORT}`);
})