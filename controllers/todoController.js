const todoModel = require('../models/todoModel');

const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!title || !description) return res.status(400).json({ message: 'Missing fields' });
        if (req.user.role !== "admin" && req.user.role !== "user") return res.status(403).json({ message: 'Forbidden' });
        const todo = {
            title,
            description,
            userId: req.user._id
        }
        // save todo to db
        const newTodo = new todoModel(todo);
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const editTodo = async (req, res) => {
    try {
        const { title, description, _id } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!title || !description || !_id) return res.status(400).json({ message: 'Missing fields' });
        if (req.user.role !== "admin" && req.user.role !== "user") return res.status(403).json({ message: 'Forbidden' });
        const countEdit = await todoModel.updateOne({ _id, userId: req.user._id }, { $set: { title, description } });
        if (countEdit.matchedCount === 0) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!_id) return res.status(400).json({ message: 'Missing fields' });
        if (req.user.role !== "admin" && req.user.role !== "user") return res.status(403).json({ message: 'Forbidden' });
        const countDeleted = await todoModel.deleteOne({ _id, userId: req.user._id });
        if (countDeleted.deletedCount === 0) return res.status(404).json({ message: 'Todo not found' });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllUserTodos = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (req.user.role !== "user") return res.status(403).json({ message: 'Forbidden' });
        const todos = await todoModel.find({ userId: req.user._id });
        return res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });

    }
}

const getAllTodos = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (req.user.role !== "admin") return res.status(403).json({ message: 'Forbidden' });
        const todos = await todoModel.find({});
        return res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });

    }
}

const toggleTodo = async(req, res)=>{
    try {
        const { _id } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!_id) return res.status(400).json({ message: 'Missing fields' });
        if (req.user.role !== "user") return res.status(403).json({ message: 'Forbidden' });
        const todo = await todoModel.findOne({ _id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        await todoModel.updateOne({ _id, userId: req.user._id }, { $set: { completed: !todo.completed } });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createTodo,
    editTodo,
    deleteTodo,
    getAllUserTodos,
    getAllTodos,
    toggleTodo
}