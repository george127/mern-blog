// Import the Post model for interacting with the posts collection in the database
import Post from '../models/post.model.js'; 
// Import the custom error handler for consistent error responses
import { errorHandler } from '../utils/error.js'; 

// Controller to create a new post
export const create = async (req, res, next) => {
  // Check if the logged-in user is an admin
  if (!req.user.isAdmin) {
    // If not, send a 403 error indicating the user is not allowed to create a post
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  // Check if required fields (title and content) are provided in the request body
  if (!req.body.title || !req.body.content) {
    // If any required field is missing, send a 400 error with a message
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // Create a slug from the title by replacing spaces with hyphens, converting to lowercase, and removing special characters
  const slug = req.body.title
    .split(' ')                   // Split the title by spaces
    .join('-')                   // Join the words with hyphens
    .toLowerCase()               // Convert to lowercase
    .replace(/[^a-zA-Z0-9-]/g, ''); // Remove any non-alphanumeric characters except hyphens

  // Create a new Post instance with the request body data, slug, and user ID
  const newPost = new Post({
    ...req.body,                // Spread operator to include other fields from the request body
    slug,                       // Add the generated slug
    userId: req.user.id,       // Add the ID of the user creating the post
  });

  // Try to save the new post to the database
  try {
    const savedPost = await newPost.save(); // Save the new post
    res.status(201).json(savedPost);        // Respond with a 201 status and the saved post data
  } catch (error) {
    next(error);                           // Pass any error to the global error handler
  }
};

// Controller to get all posts
export const getposts = async (req, res, next) => {
  try {
    // Parse pagination and sorting parameters from the query string
    const startIndex = parseInt(req.query.startIndex) || 0; // Starting index for pagination
    const limit = parseInt(req.query.limit) || 9;           // Number of posts to return
    const sortDirection = req.query.order === 'asc' ? 1 : -1; // Determine sort order (ascending or descending)

    // Find posts based on optional filters provided in the query parameters
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // Filter by user ID if provided
      ...(req.query.category && { category: req.query.category }), // Filter by category if provided
      ...(req.query.slug && { slug: req.query.slug }), // Filter by slug if provided
      ...(req.query.postId && { _id: req.query.postId }), // Filter by post ID if provided
      ...(req.query.searchTerm && { // Search for posts matching the search term in title or content
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } }, // Case-insensitive regex search for title
          { content: { $regex: req.query.searchTerm, $options: 'i' } }, // Case-insensitive regex search for content
        ],
      }),
    })
      .sort({ updatedAt: sortDirection }) // Sort posts by last updated date
      .skip(startIndex)                    // Skip to the appropriate starting index for pagination
      .limit(limit);                       // Limit the number of posts returned

    // Get the total count of posts in the database
    const totalPosts = await Post.countDocuments();

    // Get the current date
    const now = new Date();

    // Calculate the date one month ago
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Count the number of posts created in the last month
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }, // Count posts created after one month ago
    });

    // Respond with a status of 200 and the retrieved posts, total count, and count of last month's posts
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller to delete a post
export const deletepost = async (req, res, next) => {
  // Check if the logged-in user is an admin or the owner of the post
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    // If not, send a 403 error indicating the user is not allowed to delete this post
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  
  // Attempt to delete the post from the database by its ID
  try {
    await Post.findByIdAndDelete(req.params.postId); // Delete the post
    res.status(200).json('The post has been deleted'); // Respond with a success message
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};

// Controller to update a post
export const updatepost = async (req, res, next) => {
  // Check if the logged-in user is an admin or the owner of the post
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    // If not, send a 403 error indicating the user is not allowed to update this post
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  
  // Attempt to update the post in the database
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId, // ID of the post to be updated
      {
        $set: {            // Use $set to update specific fields
          title: req.body.title, // Update the title with the value from the request body
          content: req.body.content, // Update the content with the value from the request body
          category: req.body.category, // Update the category with the value from the request body
          image: req.body.image, // Update the image URL with the value from the request body
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedPost); // Respond with a status of 200 and the updated post data
  } catch (error) {
    next(error); // Pass any error to the global error handler
  }
};
