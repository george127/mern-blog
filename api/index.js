// Importing required modules
import express from 'express';             // Express for handling server and API requests
import mongoose from 'mongoose';           // Mongoose to connect and interact with MongoDB
import dotenv from 'dotenv';               // dotenv to load environment variables from a .env file
import userRoutes from './routes/user.route.js';     // User routes for handling user-related operations
import authRoutes from './routes/auth.route.js';     // Authentication routes for login, signup, etc.
import postRoutes from './routes/post.route.js';     // Post routes for managing posts (CRUD)
import commentRoutes from './routes/comment.route.js'; // Comment routes for managing comments on posts
import cookieParser from 'cookie-parser';  // Middleware to parse cookies in requests
import path from 'path';                   // Path module to handle file and directory paths
 
// Loading environment variables from the .env file (like database credentials, API keys, etc.)
dotenv.config();  
   
// Connecting to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO) // MONGO is the MongoDB URI stored in environment variables (.env)
  .then(() => {
    console.log('MongoDb is connected'); // Success callback when connection is established
  })
  .catch((err) => {
    console.log(err); // If there's an error, it's caught and logged
  });

// Defining the __dirname variable (used to serve static files later)
const __dirname = path.resolve();

// Initializing the Express application
const app = express();


// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing cookies in incoming requests
app.use(cookieParser());

// Setting up the server to listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000!'); // Callback when the server successfully starts
});

// Defining API routes
// Routes for user-related API endpoints (e.g., user profile, user data)
app.use('/api/user', userRoutes);
// Routes for authentication-related API endpoints (e.g., login, signup)
app.use('/api/auth', authRoutes);
// Routes for post-related API endpoints (e.g., create, read, update, delete posts)
app.use('/api/post', postRoutes);
// Routes for comment-related API endpoints (e.g., add, delete comments on posts)
app.use('/api/comment', commentRoutes);
  
// Serve static files from the client build (assumes client-side is built in /client/dist directory)
app.use(express.static(path.join(__dirname, '/client/dist')));

// Catch-all route to handle all unmatched requests and return the client-side index.html file
// Useful for Single Page Applications (SPA) where routing is handled on the client-side
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global error-handling middleware
// This function catches any errors that are thrown during request processing
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is provided
  const message = err.message || 'Internal Server Error'; // Default error message
  // Sending a JSON response with the error details
  res.status(statusCode).json({
    success: false,
    statusCode,
    message, 
  });
});
