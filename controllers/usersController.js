const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Get all users(GET)
const getAllUsers = asyncHandler(async (req, res) => {});

//Create a new user(POST)
const createNewUser = asyncHandler(async (req, res) => {});

//Update a user(PATCH)
const updateUser = asyncHandler(async (req, res) => {});

//Delete a user(DELETE)
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
