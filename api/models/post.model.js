// Importing Mongoose, a popular library used to interact with MongoDB and define data models
import mongoose from 'mongoose';

// Defining the schema for the 'Post' model
// This schema represents the structure of the data for posts in the application
const postSchema = new mongoose.Schema(
  {
    // 'userId' will store the ID of the user who created the post
    // This will allow the application to associate posts with their creators
    userId: {
      type: String,        // Data type: String (usually the user's unique identifier)
      required: true,      // This field is required (a post must belong to a user)
    },

    // 'content' will store the main text content of the post (like blog text or article body)
    content: {
      type: String,        // Data type: String (content of the post)
      required: true,      // This field is required (a post must have content)
    },

    // 'title' will store the title of the post
    // It must be unique, meaning no two posts can have the same title
    title: {
      type: String,        // Data type: String (title of the post)
      required: true,      // This field is required (a post must have a title)
      unique: true,        // Titles must be unique to avoid duplicate posts with the same name
    },

    // 'image' will store the URL of the image associated with the post
    // If the user doesn't provide one, a default image is used
    image: {
      type: String,        // Data type: String (URL of the image)
      default:             // Default image URL if no image is provided by the user
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },

    // 'category' is used to categorize posts (e.g., technology, travel, etc.)
    // By default, the category is set to 'uncategorized'
    category: {
      type: String,        // Data type: String (the post category)
      default: 'uncategorized', // Default category if none is provided
    },

    // 'slug' is a unique URL-friendly version of the post title
    // It is used for generating clean URLs (e.g., example.com/posts/unique-post-title)
    slug: {
      type: String,        // Data type: String (URL-friendly string version of the title)
      required: true,      // Slug is required (used in URLs)
      unique: true,        // Must be unique to prevent URL conflicts between posts
    },
  },
  {
    // Mongoose will automatically add 'createdAt' and 'updatedAt' timestamps
    // Useful for tracking when the post was created and last updated
    timestamps: true,      // Adds 'createdAt' and 'updatedAt' fields automatically
  }
);

// Creating the 'Post' model using the defined schema
// This model will be used to interact with the 'posts' collection in the MongoDB database
const Post = mongoose.model('Post', postSchema);

// Exporting the 'Post' model to make it accessible in other parts of the application
export default Post;
