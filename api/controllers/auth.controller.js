// Import necessary modules and models
import User from "../models/user.model.js"; // User model for database operations
import bcryptjs from "bcryptjs"; // Library for password hashing
import { errorHandler } from "../utils/error.js"; // Error handling utility
import jwt from "jsonwebtoken"; // Library for generating JSON Web Tokens

// Controller for user signup
export const signup = async (req, res, next) => {
  const { username, email, password, isAdmin } = req.body;

  // Check for required fields
  if (
    !username || // Check if username is provided
    !email || // Check if email is provided
    !password || // Check if password is provided
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required")); // Return error if any field is empty
  }

  // Hash the password for security
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new User instance with hashed password
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin, // 👈 will be true/false depending on what frontend sends
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.json("Signup successful"); // Respond with success message
  } catch (error) {
    next(error); // Handle errors that may occur during saving
  }
};

// Controller for user signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check for required fields
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required")); // Return error if any field is empty
  }

  try {
    // Find the user by email in the database
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found")); // Return error if user is not found
    }

    // Verify the password against the hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password")); // Return error if password is invalid
    }

    // Generate a JWT token upon successful signin
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin }, // Include user ID and admin status in token payload
      process.env.JWT_SECRET // Secret key for signing the token
    );

    // Destructure user data to exclude the password before sending response
    const { password: pass, ...rest } = validUser._doc;

    // Set the token as a cookie and respond with user data
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true, // Cookie is only accessible by the server for security
      })
      .json(rest); // Send the user data excluding the password
  } catch (error) {
    next(error); // Handle errors that may occur during signin
  }
};

// Controller for Google authentication
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body; // Destructure data from request body
  try {
    // Check if the user already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      // Generate a JWT token if user exists
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin }, // Include user ID and admin status in token payload
        process.env.JWT_SECRET // Secret key for signing the token
      );
      const { password, ...rest } = user._doc; // Exclude password from user data
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true, // Cookie is only accessible by the server for security
        })
        .json(rest); // Send user data
    } else {
      // Generate a random password for new users who sign in with Google
      const generatedPassword =
        Math.random().toString(36).slice(-8) + // Generate random string
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the generated password

      // Create a new User instance with Google data
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") + // Generate a unique username
          Math.random().toString(9).slice(-4), // Append random digits to the username
        email,
        password: hashedPassword, // Store hashed password
        profilePicture: googlePhotoUrl, // Save Google profile picture
      });

      // Save the new user to the database
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin }, // Include user ID and admin status in token payload
        process.env.JWT_SECRET // Secret key for signing the token
      );
      const { password, ...rest } = newUser._doc; // Exclude password from user data
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true, // Cookie is only accessible by the server for security
        })
        .json(rest); // Send user data
    }
  } catch (error) {
    next(error); // Handle errors that may occur during Google authentication
  }
};
