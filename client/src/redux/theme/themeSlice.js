/*  This code manages the theme (light or dark) of an app. Here's a simple breakdown:

Initial Setup: The theme starts as 'light' by default.

Action (What the app can do): There's only one action here — toggling the theme between 'light' and 'dark'.

What Happens:

When the toggleTheme action is called, it checks the current theme.
If it's 'light', it switches to 'dark'; if it's 'dark', it switches back to 'light'.
Why This Matters: It allows users to switch between light and dark modes in the app, making it visually customizable.

In short, this code handles changing the app's appearance between light and dark themes. */  

// Import the createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the theme slice
const initialState = {
    theme: 'light', // Default theme set to 'light'
};

// Create a slice of the Redux store for theme management
const themeSlice = createSlice({
    name: 'theme', // Name of the slice
    initialState,  // Initial state for the slice
    reducers: {
        // Action to toggle between light and dark themes
        toggleTheme: (state) => {
            // Update the theme based on the current value
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

// Export the action creator for toggling the theme
export const { toggleTheme } = themeSlice.actions;

// Export the reducer to be used in the Redux store
export default themeSlice.reducer;  
