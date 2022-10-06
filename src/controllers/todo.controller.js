const mongoose = require("mongoose");
const Todo = require("../models/todo.model");
const Joi = require("joi");
const catchAsync = require("../utils/catchAsync");

//Validate Todo schema
const todoSchema = Joi.object().keys({
  task: Joi.string().required().max(255),
  description: Joi.string().required().max(500),
});

class TodoController {
  addTask = catchAsync(async (req, res) => {
    const result = todoSchema.validate(req.body);
    if (result.error) {
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }
    result.value.userId = req.decoded.uid;
    const newTodo = new Todo(result.value);
    await newTodo.save();
    return res.status(200).json({
      success: true,
      message: "Task Created Successfully",
      data: newTodo,
    });
  });

  listTasks = catchAsync(async (req, res) => {
    const sort = {};
    if (req.query.sortBy && req.query.sortOrder) {
      Object.assign(sort, { [req.query.sortBy]: req.query.sortOrder });
    }
    let queryOptions = { userId: req.decoded.uid };
    if (req.query.search) {
      const options = {
        $and: [
          {
            task: {
              $in: req.query.search,
            },
          },
        ],
      };
      Object.assign(queryOptions, options);
    }
    const tasks = await Todo.find(queryOptions).sort(sort);
    return res.status(200).json({
      success: true,
      message: "Task List Fetched Successfully",
      data: tasks,
    });
  });

  updateTaskStatus = catchAsync(async (req, res) => {
    const filter = {_id: req.query.task_id, userId: req.decoded.uid};
    const update = {status: req.query.status};
    const task = await Todo.findOneAndUpdate(filter, update);
    return res.status(200).json({
      success: true,
      message: "Task Status Updated Successfully",
      data: task,
    });
  });

  deleteTask = catchAsync(async (req, res) => {
    const task = await Todo.deleteOne({_id: req.query.task_id, userId: req.decoded.uid});
    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
      data: task,
    });
  });

  editTask = catchAsync(async (req, res) => {
    const filter = {_id: req.query.task_id, userId: req.decoded.uid};
    const update = {
        task: req.body.task,
        description: req.body.description
    };
    const task = await Todo.findOneAndUpdate(filter, update);
    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      data: task,
    });
  });

  getTask = catchAsync(async (req, res) => {
    
    const task = await Todo.findOne({_id: req.query.task_id, userId: req.decoded.uid});
    return res.status(200).json({
      success: true,
      message: "Task Fetched Successfully",
      data: task,
    });
  });
}

module.exports = new TodoController();
