// Importing the 'express' framework to handle routing and API requests
import express from 'express';

// Importing controller functions that manage user-related operations
import { 
  deleteUser,  // Controller for deleting a specific user
  getUser,     // Controller for retrieving details of a specific user
  getUsers,    // Controller for retrieving a list of all users
  signout,     // Controller for signing out a user
  test,        // Controller for testing the user routes (for development/debugging)
  updateUser   // Controller for updating details of a specific user
} from '../controllers/user.controller.js';

// Importing the 'verifyToken' middleware, which checks if a user is authenticated before they can access certain routes
import { verifyToken } from '../utils/verifyUser.js';

// Creating a new Express Router instance to handle user-related routes
const router = express.Router();

// Route 1: GET /test
// This is a test route, typically used for checking if the server and routes are working correctly during development
// The 'test' controller will handle the request and return a response
router.get('/test', test);

// Route 2: PUT /update/:userId
// This route allows an authenticated user to update their own user details
// The 'verifyToken' middleware ensures that only authenticated users can access this route
// The ':userId' is a dynamic parameter that represents the ID of the user being updated
// The 'updateUser' controller function will handle the logic for updating the user's details in the database
router.put('/update/:userId', verifyToken, updateUser);

// Route 3: DELETE /delete/:userId
// This route allows an authenticated user to delete their own user account
// The 'verifyToken' middleware ensures that only authenticated users can delete their accounts
// The ':userId' is a dynamic parameter that represents the ID of the user being deleted
// The 'deleteUser' controller function will handle the logic for removing the user's account from the database
router.delete('/delete/:userId', verifyToken, deleteUser);

// Route 4: POST /signout
// This route handles user sign-out (logging the user out of their session)
// No authentication is required to sign out, so the 'verifyToken' middleware is not used here
// The 'signout' controller function will handle the logic for logging the user out (usually by clearing cookies or tokens)
router.post('/signout', signout);

// Route 5: GET /getusers
// This route allows an authenticated user to retrieve a list of all users
// The 'verifyToken' middleware ensures that only authenticated users can access this route
// The 'getUsers' controller function will handle the logic for fetching all users from the database
router.get('/getusers', verifyToken, getUsers);

// Route 6: GET /:userId
// This route retrieves the details of a specific user by their ID
// The ':userId' is a dynamic parameter that represents the ID of the user being fetched
// The 'getUser' controller function will handle the logic for fetching the user's details from the database
// No authentication is required to view a user's details, so 'verifyToken' is not used here
router.get('/:userId', getUser);

// Exporting the router so it can be used in other parts of the application
// This export allows the routes to be mounted and used in the main app file (usually app.js or index.js)
export default router;
