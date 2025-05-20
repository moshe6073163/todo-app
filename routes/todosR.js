const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/user');
const { createTodo, editTodo,deleteTodo, getAllUserTodos, getAllTodos, toggleTodo } = require('../controllers/todoController');

router.get("/", (req, res) => {
    res.status(200).json({ message: 'Welcome to the Todos API' });
})

router.post("/createTodo", checkLogin, createTodo);
router.post("/editTodo", checkLogin, editTodo);
router.post("/deleteTodo", checkLogin, deleteTodo);
router.post("/getAllUserTodos", checkLogin, getAllUserTodos);
router.post("/getAllTodos", checkLogin, getAllTodos);
router.post("/toggleTodo", checkLogin, toggleTodo);

module.exports = router;