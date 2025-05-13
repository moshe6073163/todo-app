const { readUsers, writeUsers } = require('../utils/fileHandler');
const { v4: uuidv4 } = require('uuid');
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require('../functions/functions');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Missing token' });
    const currUser = await verifyToken(token);
    if (!currUser || currUser.role !== "admin") return res.status(401).json({ message: 'Invalid credentials' });
    const users = await userModel.find({}, { profile: 1, email: 1, role: 1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    if (!email, !token) return res.status(400).json({ message: 'Missing email' });
    const currUser = await verifyToken(token);
    if (!currUser || currUser.role !== "admin") return res.status(401).json({ message: 'Invalid credentials' });
    const user = await userModel.findOne({ email }, { profile: 1, email: 1, role: 1 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 8) return res.status(400).json({ message: 'Missing required fields!' });
    const user = await userModel.findOne({ email }, { profile: 1, email: 1, password: 1, role: 1, id: 1 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials!' });
    delete user._doc.password;
    const token = generateToken(user);
    res.status(200).json({ ...user._doc, token });
  } catch (err) {
    next(err);
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { profile, email, password } = req.body;
    if ((!profile || !profile?.firstName || !profile?.lastName) || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const isExist = await userModel.findOne({ email });
    if (isExist) return res.status(400).json({ message: 'User already exists' });
    const newUser = new userModel({ id: uuidv4(), profile, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// update user profile only himself
exports.updateUser = async (req, res, next) => {
  try {
    const { profile, token } = req.body;
    if (!profile || !token) return res.status(400).json({ message: 'Missing fields' });
    const currUser = await verifyToken(token);
    if (!currUser) return res.status(401).json({ message: 'Invalid credentials' });
    await userModel.updateOne({ email: currUser.email }, { $set: { profile: profile, } });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// update user profile by admin
exports.updateOtherUser = async (req, res, next) => {
  try {
    const { profile, email, token } = req.body;
    if (!profile || !email || !token) return res.status(400).json({ message: 'Missing fields' });
    const currUser = verifyToken(token);
    if (!currUser || currUser.role !== "admin") return res.status(401).json({ message: 'Invalid credentials' });
    const targetUser = await userModel.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    await userModel.updateOne({ email: targetUser.email }, { $set: { profile: profile, } });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// delete user himself
exports.deleteUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Missing fields' });
    const currUser = verifyToken(token);
    if (!currUser) return res.status(404).json({ message: 'User not found' });
    await userModel.deleteOne({ email });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// delete user by admin
exports.deleteOtherUser = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ message: 'Missing fields' });
    const currUser = verifyToken(token);
    if (!currUser || currUser.role !== "admin") return res.status(401).json({ message: 'Invalid credentials' });
    const targetUser = await userModel.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    await userModel.deleteOne({ email: targetUser.email });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};