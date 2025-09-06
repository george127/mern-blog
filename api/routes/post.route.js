// Importing the 'express' framework to handle routing and API requests
import express from 'express';

// Importing a middleware function (verifyToken) that checks if the user is authenticated (has a valid token)
import { verifyToken } from '../utils/verifyUser.js';

// Importing the controller functions for managing posts
// These functions handle creating, deleting, retrieving, and updating posts
import { 
  create,       // Controller for creating a new post
  deletepost,   // Controller for deleting an existing post
  getposts,     // Controller for retrieving all posts
  updatepost    // Controller for updating an existing post
} from '../controllers/post.controller.js';

// Creating a new Express Router instance
// This router will handle all post-related routes
const router = express.Router();

// Route 1: POST /create
// This route allows an authenticated user to create a new post
// The 'verifyToken' middleware ensures the user is logged in (authenticated) by validating their token before allowing the post creation.
// The 'create' controller function handles the logic for saving the new post to the database.
router.post('/create', verifyToken, create);

// Route 2: GET /getposts
// This route retrieves all posts (likely from multiple users)
// No authentication is required to view posts, so 'verifyToken' is not used here.
// The 'getposts' controller function handles fetching the posts from the database.
router.get('/getposts', getposts);

// Route 3: DELETE /deletepost/:postId/:userId
// This route allows an authenticated user to delete a specific post
// The 'verifyToken' middleware ensures the user is authenticated before allowing the delete action.
// The ':postId' and ':userId' in the URL are dynamic parameters used to identify the post being deleted and the user making the request.
// The 'deletepost' function in the controller handles the logic of removing the post from the database.
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);

// Route 4: PUT /updatepost/:postId/:userId
// This route allows an authenticated user to update a specific post they created
// The 'verifyToken' middleware ensures the user is authenticated before allowing the update action.
// The ':postId' and ':userId' parameters in the URL are used to identify the post being updated and the user making the request.
// The 'updatepost' controller function handles the logic for updating the post in the database.
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);

// Exporting the router so it can be used in other parts of the application
// This export allows the routes to be mounted and used in the main app file (usually app.js or index.js).
export default router;
