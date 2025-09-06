// Import necessary modules
import bcryptjs from 'bcryptjs';  // bcryptjs is used to hash passwords
import { errorHandler } from '../utils/error.js';  // Custom error handling function
import User from '../models/user.model.js';  // User model for interacting with the MongoDB collection

// Simple test controller to check if API is working
export const test = (req, res) => {
  // Returns a JSON response with a success message
  res.json({ message: 'API is working!' });
};

// Controller to update a user's details
export const updateUser = async (req, res, next) => {
  // Check if the logged-in user is trying to update their own account
  if (req.user.id !== req.params.userId) {
    // If not, throw an error
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  // If the user is trying to update their password
  if (req.body.password) {
    // Validate the password length (must be at least 6 characters)
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    // Hash the new password before saving it
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // If the user is trying to update their username
  if (req.body.username) {
    // Validate that the username is between 7 and 20 characters
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    // Ensure the username does not contain spaces
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    // Ensure the username is lowercase
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    // Ensure the username only contains letters and numbers
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }

  // Attempt to update the user details in the database
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId, // ID of the user to be updated
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true } // Return the updated document
    );

    // Exclude the password from the response before sending it back
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller to delete a user
export const deleteUser = async (req, res, next) => {
  // Check if the logged-in user is an admin or trying to delete their own account
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  // Attempt to delete the user from the database
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller for signing out a user
export const signout = (req, res, next) => {
  try {
    // Clear the user's access token (stored as a cookie)
    res.clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller to get all users (admin only)
export const getUsers = async (req, res, next) => {
  // Only an admin can access all users
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    // Parse query parameters for pagination and sorting
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    // Find and retrieve users from the database with pagination
    const users = await User.find()
      .sort({ createdAt: sortDirection }) // Sort users by creation date
      .skip(startIndex)                   // Skip to the appropriate starting index
      .limit(limit);                      // Limit the number of users returned

    // Exclude passwords from the response
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Get the total number of users in the database
    const totalUsers = await User.countDocuments();

    // Get the number of users created in the last month
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Respond with user data, total users, and recent user count
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller to get a single user by ID
export const getUser = async (req, res, next) => {
  try {
    // Find the user in the database by their ID
    const user = await User.findById(req.params.userId);
    
    // If the user is not found, throw a 404 error
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Exclude the password from the response
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};
