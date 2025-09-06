// Importing Mongoose, which is used for interacting with MongoDB and defining schemas for the data model
import mongoose from "mongoose";

// Defining the schema for the 'User' model
// This schema will represent how a user object should be structured in the MongoDB database
const userSchema = new mongoose.Schema(
  {
    // The 'username' field will store the user's name
    // It's a string and is required to create a new user
    // The 'unique' property ensures that no two users can have the same username
    username: {
      type: String, // Data type: String
      required: true, // This field is required (cannot be empty)
      unique: true, // This field must be unique (no duplicate usernames allowed)
    },

    // The 'email' field will store the user's email address
    // It's a string, required, and also unique to ensure no duplicate email addresses
    email: {
      type: String, // Data type: String
      required: true, // This field is required (cannot be empty)
      unique: true, // Email must be unique across all users
    },

    // The 'password' field will store the user's password
    // It's required and will be a hashed string (usually hashed before saving)
    password: {
      type: String, // Data type: String
      required: true, // This field is required (cannot be empty)
    },

    // The 'profilePicture' field stores the URL of the user's profile picture
    // If the user doesn't provide one, a default image URL is used
    profilePicture: {
      type: String, // Data type: String (URL of the image)
      // Default value if no picture is provided
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },

    // The 'isAdmin' field is a boolean flag to check if the user has admin privileges
    // By default, users are not admins
    isAdmin: {
      type: Boolean,
      default: true, // 👈 Makes every new user an admin
    },
  },
  {
    // Mongoose will automatically add 'createdAt' and 'updatedAt' timestamps
    // This is useful for tracking when the user was created and last updated
    timestamps: true, // Adds 'createdAt' and 'updatedAt' fields automatically
  }
);

// Creating the 'User' model using the defined schema
// This model will be used to interact with the 'users' collection in the MongoDB database
const User = mongoose.model("User", userSchema);

// Exporting the 'User' model to make it accessible in other parts of the application
export default User;
