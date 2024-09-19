const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Get all users(GET)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

//Create a new user(POST)
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  // Check data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ username }).lean().exec();
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10); //10 salt rounds

  const userData = { username, password: hashedPassword, roles };
  //   create a new user
  const user = await User.create(userData);
  if (user) {
    res.status(201).json({ message: `User: ${user.username} created` });
  } else {
    res.status(400).json({ message: "Failed to create user." });
  }
});

//Update a user(PATCH)
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    // check data
    return res.status(400).json({ message: "All fields are required." });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }
  //   check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow update
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists." });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `User: ${updatedUser.username} updated` });
});

//Delete a user(DELETE)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "Cannot delete user with notes." });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }
  const result = await user.deleteOne();
  const reply = `Username:${result.username} ID:${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
