const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect); // All routes below are protected

router
  .route('/')
  .get(authorize('Admin', 'Manager'), getUsers)
  .post(authorize('Admin'), createUser);

router
  .route('/:id')
  .get(authorize('Admin', 'Manager'), getUser)
  .put(authorize('Admin', 'Manager'), updateUser)
  .delete(authorize('Admin'), deleteUser);

module.exports = router;
