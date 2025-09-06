// Importing the 'jsonwebtoken' library to work with JWTs (JSON Web Tokens)
import jwt from 'jsonwebtoken';

// Importing the custom error handler function to create consistent error responses
import { errorHandler } from './error.js';

// This function is a middleware to verify the JWT (JSON Web Token) provided by the client.
// It checks if the token is valid, extracts user information, and passes it to the next middleware or route handler.
export const verifyToken = (req, res, next) => {
  
  // Step 1: Retrieve the JWT token from the cookies in the incoming request
  // The token is expected to be stored in a cookie called 'access_token'.
  const token = req.cookies.access_token;

  // Step 2: Check if the token is missing (i.e., the user hasn't provided a token in the request)
  if (!token) {
    // If no token is found, respond with a 401 Unauthorized error using the custom errorHandler function
    // The errorHandler takes a status code (401) and a message ('Unauthorized') to return a structured error.
    return next(errorHandler(401, 'Unauthorized'));
  }

  // Step 3: Verify the JWT token using 'jwt.verify'
  // The first argument is the token from the cookies, and the second is the secret key used to sign the token.
  // The secret key (stored in the environment variable `JWT_SECRET`) is used to validate the token's authenticity.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    
    // Step 4: If there's an error in verifying the token (e.g., the token is invalid or expired)
    if (err) {
      // Respond with a 401 Unauthorized error using the custom errorHandler function.
      return next(errorHandler(401, 'Unauthorized'));
    }
    
    // Step 5: If the token is valid, the user information (stored in the token) is extracted and attached to the request object.
    // This allows other middlewares or route handlers to access `req.user` to get user details (e.g., user ID, role).
    req.user = user;
    
    // Step 6: Call 'next()' to pass control to the next middleware or route handler in the request-response cycle.
    // If the token is valid and no errors are encountered, the next middleware will execute.
    next();
  });
};
