const express = require('express');
const router = express.Router();
const { todoController } = require('../controllers/index')
const { validateToken } = require("../middlewares/validateToken");

router.get('/list', validateToken, todoController.listTasks);

router.post('/add', validateToken, todoController.addTask);

router.patch('/update-status', validateToken, todoController.updateTaskStatus);

router.delete('/delete', validateToken, todoController.deleteTask);

router.put('/edit', validateToken, todoController.editTask);

router.get('/getTask', validateToken, todoController.getTask);


module.exports = router;