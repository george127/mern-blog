/* This code helps manage the "user" information in an app, like when someone logs in or out. Here's how it works in simple terms:

Initial Setup: The app starts by assuming no one is logged in (currentUser: null), there are no errors (error: null), 
and nothing is loading (loading: false).

Actions (Things the app can do): The app has actions for logging in, updating user info, deleting a user, and logging out. For each action,
it can either start the process, succeed, or fail.

What Happens:

When you start logging in, it sets a "loading" flag to show something is happening.
If the login succeeds, it stores the user info and turns off the loading flag.
If it fails, it shows an error message and stops loading.
Similar steps happen for updating or deleting a user.
Why This Matters: It makes sure the app knows who’s logged in, shows if something is in progress, and handles errors gracefully, like when login fails.

In short, this code manages the flow of user actions (login, update, delete) and keeps the app state in sync. */

// Import the createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null, // Store the currently signed-in user
  error: null, // Store error messages, if any
  loading: false, // Loading state for async operations
};

// Create a slice of the Redux store
const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    // Action to indicate the start of the sign-in process
    signInStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Reset any previous error
    },
    // Action for successful sign-in
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Update the current user with the payload
      state.loading = false; // Set loading to false
      state.error = null; // Reset any previous error
    },
    // Action for sign-in failure
    signInFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set the error message from the action payload
    },
    // Action to indicate the start of a user update process
    updateStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Reset any previous error
    },
    // Action for successful user update
    updateSuccess: (state, action) => {
      state.currentUser = action.payload; // Update the current user with the payload
      state.loading = false; // Set loading to false
      state.error = null; // Reset any previous error
    },
    // Action for user update failure
    updateFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set the error message from the action payload
    },
    // Action to indicate the start of user deletion
    deleteUserStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Reset any previous error
    },
    // Action for successful user deletion
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear the current user
      state.loading = false; // Set loading to false
      state.error = null; // Reset any previous error
    },
    // Action for user deletion failure
    deleteUserFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set the error message from the action payload
    },
    // Action for successful sign-out
    signoutSuccess: (state) => {
      state.currentUser = null; // Clear the current user
      state.error = null; // Reset any previous error
      state.loading = false; // Set loading to false
    },
  },
});

// Export actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
