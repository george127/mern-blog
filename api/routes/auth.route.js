// Importing the 'express' framework to handle routing and API requests
import express from "express";

// Importing the authentication controllers (signup, signin, google) that handle the business logic for these routes
import { google, signin, signup } from "../controllers/auth.controller.js";

// Creating a new Express Router instance
// This router will handle all authentication-related routes (signup, signin, and Google authentication)
const router = express.Router();

// Route 1: POST /signup
// This route is used for user registration (signup)
// It triggers the 'signup' controller function when a POST request is made to /signup.
// The 'signup' function in 'auth.controller.js' will contain the logic to create a new user in the database.
router.post("/signup", signup);

// Route 2: POST /signin
// This route is for user login (signin)
// When a POST request is made to /signin, the 'signin' controller function is triggered.
// The 'signin' function in 'auth.controller.js' will handle verifying the user's credentials and generating a token if successful.
router.post("/signin", signin);

// Route 3: POST /google
// This route handles Google OAuth login (signin via Google account)
// When a POST request is made to /google, the 'google' controller function is called.
// The 'google' function in 'auth.controller.js' will handle Google OAuth authentication and manage user sessions for Google login.
router.post("/google", google);

// Exporting the router so it can be used in other parts of the application
// This export allows the routes to be mounted and used in the main app file (usually app.js or index.js).
export default router;
