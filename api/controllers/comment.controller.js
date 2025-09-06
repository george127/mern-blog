// Import the Comment model for interacting with the comments collection in the database
import Comment from '../models/comment.model.js'; 

// Controller to create a new comment
export const createComment = async (req, res, next) => {
  try {
    // Destructure the content, postId, and userId from the request body
    const { content, postId, userId } = req.body;

    // Ensure that the user ID matches the ID of the logged-in user
    if (userId !== req.user.id) {
      // If not, send a 403 error indicating the user is not allowed to create this comment
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    // Create a new Comment instance with the provided content, postId, and userId
    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    // Save the comment to the database
    await newComment.save();

    // Respond with the newly created comment and a status of 200
    res.status(200).json(newComment);
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

// Controller to get all comments for a specific post
export const getPostComments = async (req, res, next) => {
  try {
    // Find comments related to the specific post ID and sort them by creation date in descending order
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1, // Sort by most recent comments first
    });

    // Respond with the list of comments and a status of 200
    res.status(200).json(comments);
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

// Controller to like or unlike a comment
export const likeComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    // Check if the comment was found
    if (!comment) {
      // If not found, send a 404 error indicating the comment is not found
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      // User hasn't liked the comment yet, so add like
      comment.numberOfLikes += 1; // Increment like count
      comment.likes.push(req.user.id); // Add user ID to likes array
    } else {
      // User has already liked the comment, so remove like
      comment.numberOfLikes -= 1; // Decrement like count
      comment.likes.splice(userIndex, 1); // Remove user ID from likes array
    }

    // Save the updated comment to the database
    await comment.save();

    // Respond with the updated comment and a status of 200
    res.status(200).json(comment);
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

// Controller to edit a comment
export const editComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    // Check if the comment was found
    if (!comment) {
      // If not found, send a 404 error indicating the comment is not found
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      // If not, send a 403 error indicating the user is not allowed to edit this comment
      return next(
        errorHandler(403, 'You are not allowed to edit this comment')
      );
    }

    // Update the comment content with the new value from the request body
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content, // Set the new content
      },
      { new: true } // Return the updated document
    );

    // Respond with the updated comment and a status of 200
    res.status(200).json(editedComment);
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

// Controller to delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    // Check if the comment was found
    if (!comment) {
      // If not found, send a 404 error indicating the comment is not found
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      // If not, send a 403 error indicating the user is not allowed to delete this comment
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }

    // Delete the comment by its ID
    await Comment.findByIdAndDelete(req.params.commentId);

    // Respond with a success message indicating the comment has been deleted
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};

// Controller to get all comments (admin only)
export const getcomments = async (req, res, next) => {
  // Ensure the user is an admin
  if (!req.user.isAdmin)
    // If not, send a 403 error indicating the user is not allowed to get all comments
    return next(errorHandler(403, 'You are not allowed to get all comments'));

  try {
    // Set pagination parameters from query string or defaults
    const startIndex = parseInt(req.query.startIndex) || 0; // Default to 0 if not provided
    const limit = parseInt(req.query.limit) || 9; // Default to 9 if not provided
    const sortDirection = req.query.sort === 'desc' ? -1 : 1; // Determine sort order based on query parameter

    // Find all comments with pagination and sorting
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection }) // Sort by creation date (newest first if descending)
      .skip(startIndex) // Skip to the specified starting index
      .limit(limit); // Limit the number of results returned

    // Get the total number of comments in the database
    const totalComments = await Comment.countDocuments();

    // Calculate the number of comments created in the last month
    const now = new Date(); // Get the current date
    const oneMonthAgo = new Date( // Create a date object for one month ago
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    // Count the comments created in the last month
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }, // Count comments created after one month ago
    });

    // Respond with the list of comments, total count, and count from the last month
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error); // Pass any errors to the global error handler
  }
};
