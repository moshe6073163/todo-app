const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserByEmail,
  signUp,
  updateUser,
  deleteUser,
  signIn,
  updateOtherUser,
  deleteOtherUser
} = require('../controllers/usersController');
const { checkLogin } = require('../middleware/user');

router.post('/getAllUsers', checkLogin, getAllUsers);
router.post('/signUp', signUp); 
router.post('/getUserByEmail', checkLogin, getUserByEmail);
router.put('/updateUser', checkLogin, updateUser);
router.put('/updateOtherUser', checkLogin, updateOtherUser);
router.delete('/deleteUser', checkLogin, deleteUser);
router.delete('/deleteOtherUser', checkLogin, deleteOtherUser);
router.post('/signIn', signIn);

module.exports = router;