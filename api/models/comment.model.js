// Importing Mongoose, a library used for MongoDB interactions and to define data models
import mongoose from 'mongoose';

// Defining the schema for the 'Comment' model
// This schema represents the structure of data for comments on posts
const commentSchema = new mongoose.Schema(
  {
    // 'content' stores the actual text of the comment
    content: {
      type: String,        // Data type: String (text content of the comment)
      required: true,      // This field is required (every comment must have content)
    },

    // 'postId' stores the ID of the post that the comment belongs to
    postId: {
      type: String,        // Data type: String (ID of the related post)
      required: true,      // This field is required (a comment must belong to a post)
    },

    // 'userId' stores the ID of the user who made the comment
    userId: {
      type: String,        // Data type: String (ID of the user who created the comment)
      required: true,      // This field is required (a comment must be associated with a user)
    },

    // 'likes' is an array that will hold the user IDs of users who liked the comment
    likes: {
      type: Array,         // Data type: Array (list of users who liked the comment)
      default: [],         // Default value: an empty array (no likes initially)
    },

    // 'numberOfLikes' stores the number of likes on the comment
    numberOfLikes: {
      type: Number,        // Data type: Number (count of likes on the comment)
      default: 0,          // Default value: 0 (no likes initially)
    },
  },
  {
    // Mongoose will automatically add 'createdAt' and 'updatedAt' timestamps
    // Useful for tracking when the comment was created and last updated
    timestamps: true,      // Adds 'createdAt' and 'updatedAt' fields automatically
  }
);

// Creating the 'Comment' model using the defined schema
// This model will be used to interact with the 'comments' collection in the MongoDB database
const Comment = mongoose.model('Comment', commentSchema);

// Exporting the 'Comment' model to make it accessible in other parts of the application
export default Comment;
