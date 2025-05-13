const express = require('express');
const router = express.Router();
const { checkAccess } = require('../middleware/user');

router.get("/", (req, res) => {
    res.status(200).json({ message: 'Welcome to the Todos API' });
})

/*
* create a new todo
* edit a todo
* delete a todo
* get all todos by user role
* get all todos only admin
* toggle todo status
*/

module.exports = router;