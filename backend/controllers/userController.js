import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email });

  //check if user exist AND password match
  if (userExist && (await userExist.verifyPassword(password))) {
    generateToken(res, userExist._id);

    return res.status(200).json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      isAdmin: userExist.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Bad Credentials');
  }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  const user = await User.create({ name, email, password });

  // if user succesfully saved to the db
  if (user) {
    generateToken(res, user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expiresIn: new Date(0) });

  return res.status(200).json({ message: 'Log out successful' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // console.log(req.body);
  // console.log(Boolean(req.body.password));
  console.log(user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    console.log(updatedUser);
    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('user not found');
  }
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  //exclude password field
  const users = await User.find({}).select('-password');
  return res.status(200).json(users);
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    return res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
// refactor maybe if user still has active order cant be deleted
//dont forget to add cant delete user if there is order
//cause it will cause big fat error
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    //cannot delete admin user
    if (user.isAdmin) {
      res.status(404);
      throw new Error('Admin cannot be deleted');
    }
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'User Deleted' });
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

// @desc    update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  //since at the frontend were going to populate the form with existing data
  //then we dont have to type user.name = req.body.name || user.name, just user.name = req.body.name
  const { name, email, isAdmin } = req.body;
  console.log(user);
  if (user) {
    user.name = name;
    user.email = email;
    user.isAdmin = Boolean(isAdmin);
    const updatedUser = await user.save();
    console.log(updatedUser);
    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
