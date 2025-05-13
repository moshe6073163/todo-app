const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserByEmail,
  signUp,
  updateUser,
  deleteUser,
  signIn
} = require('../controllers/usersController');
const { checkAccess } = require('../middleware/user');

router.post('/getAllUsers', checkAccess, getAllUsers);
router.post('/signUp', signUp);
router.post('/getUserByEmail', getUserByEmail);
router.put('/updateUser', updateUser);
router.delete('/deleteUser', deleteUser);
router.post('/signIn', signIn);

module.exports = router;