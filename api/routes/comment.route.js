// Importing the 'express' framework to handle routing and API requests
import express from 'express';

// Importing a middleware function (verifyToken) that checks if the user is authenticated (has a valid token)
import { verifyToken } from '../utils/verifyUser.js';

// Importing the controller functions for managing comments
// These functions handle creating, editing, deleting, liking comments, and retrieving comments
import {
  createComment,     // Controller to handle creating a new comment
  deleteComment,     // Controller to handle deleting a comment
  editComment,       // Controller to handle editing an existing comment
  getPostComments,   // Controller to get comments associated with a specific post
  getcomments,       // Controller to get all comments (possibly across all posts or based on specific criteria)
  likeComment        // Controller to handle liking a comment
} from '../controllers/comment.controller.js';

// Creating a new Express Router instance
// This router will handle all comment-related routes
const router = express.Router();

// Route 1: POST /create
// This route allows an authenticated user to create a comment
// The 'verifyToken' middleware ensures the user is logged in by validating their token before allowing the comment creation.
// The 'createComment' function in 'comment.controller.js' handles the logic for creating the comment.
router.post('/create', verifyToken, createComment);

// Route 2: GET /getPostComments/:postId
// This route retrieves all comments for a specific post (indicated by ':postId')
// The 'getPostComments' controller retrieves comments related to the post with the ID passed as a URL parameter.
router.get('/getPostComments/:postId', getPostComments);

// Route 3: PUT /likeComment/:commentId
// This route allows an authenticated user to like a comment
// The 'verifyToken' middleware ensures the user is logged in before allowing the like operation.
// The ':commentId' parameter is the ID of the comment being liked, and 'likeComment' handles the logic for liking it.
router.put('/likeComment/:commentId', verifyToken, likeComment);

// Route 4: PUT /editComment/:commentId
// This route allows an authenticated user to edit a comment they made
// The 'verifyToken' middleware ensures the user is logged in, and the ':commentId' parameter identifies the comment to be edited.
// The 'editComment' function handles the logic for modifying the comment.
router.put('/editComment/:commentId', verifyToken, editComment);

// Route 5: DELETE /deleteComment/:commentId
// This route allows an authenticated user to delete a comment they made
// The 'verifyToken' middleware ensures the user is logged in, and the ':commentId' parameter identifies the comment to be deleted.
// The 'deleteComment' function handles the logic for removing the comment from the database.
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);

// Route 6: GET /getcomments
// This route retrieves all comments (likely across multiple posts or based on specific criteria)
// The 'verifyToken' middleware ensures the user is logged in before allowing them to access the comments.
// The 'getcomments' controller handles fetching the comments.
router.get('/getcomments', verifyToken, getcomments);

// Exporting the router so it can be used in other parts of the application
// This export allows the routes to be mounted and used in the main app file (usually app.js or index.js).
export default router;
