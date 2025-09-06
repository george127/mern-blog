// A custom error handler function to streamline error creation and handling
// This function creates a new error object and attaches additional information (status code and message) to it.

export const errorHandler = (statusCode, message) => {
  // Step 1: Create a new error object using the Error constructor
  const error = new Error();
  
  // Step 2: Attach the status code to the error object
  // The status code (e.g., 404 for "Not Found" or 500 for "Internal Server Error")
  // is passed in as an argument and is assigned to the error object.
  // This helps in identifying the type of error when it's caught and processed.
  error.statusCode = statusCode;
  
  // Step 3: Attach a custom error message to the error object
  // The message provides more context about the error (e.g., "User not found", "Unauthorized access").
  // This message is also passed as an argument and is assigned to the error object's `message` property.
  error.message = message;
  
  // Step 4: Return the error object with the custom status code and message
  // This makes it easy to throw custom errors with meaningful information in other parts of the code.
  // Whenever this function is called, it generates and returns a fully-formed error object.
  return error;
};
