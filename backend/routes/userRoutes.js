import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';

router.route('/').post(registerUser).get(getUsers);
router.route('/login').post(authUser);
router.route('/logout').post(logoutUser);
router.route('/profile').get(getUserProfile).put(updateUserProfile);
//this :id must be at bottom cause it will match everything
router.route('/:id').get(getUserById).delete(deleteUser).put(updateUser);

export default router;
