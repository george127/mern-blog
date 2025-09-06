/* This code sets up a Redux store with persistence, meaning the app can remember user data (like login info)
 and settings (like the theme) even after refreshing the page. Here’s a simple explanation:

Reducers: It combines two "managers" (reducers), one for handling user info and one for the theme (light/dark).

Persistence: It uses Redux Persist, a tool that saves the app’s state (user and theme) in local storage, 
so the app can keep the same data when reopened.

What Happens:

When you use the app, the state is stored in the browser’s local storage.
If you refresh the page or come back later, the app will load the saved user and theme info from local storage.
Why This Matters: It keeps user settings, like being logged in or the preferred theme, even if the page is reloaded.

In short, this code helps the app remember key information (user and theme) between visits or refreshes.  */

// Import necessary functions and libraries from Redux Toolkit and Redux Persist
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'; // Import user slice reducer
import themeReducer from './theme/themeSlice'; // Import theme slice reducer
import { persistReducer, persistStore } from 'redux-persist'; // Import persist functions
import storage from 'redux-persist/lib/storage'; // Use local storage for persistence

// Combine individual reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer, // User state management
  theme: themeReducer, // Theme state management
});

// Configuration for Redux Persist
const persistConfig = {
  key: 'root', // Key for storage
  storage, // Storage method (local storage in this case)
};

// Wrap the root reducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore specific actions for serialization check
        ignoredPaths: ['register'], // Ignore specific state paths for serialization check
      },
    }),
});

// Create a persistor for managing persisted state
export const persistor = persistStore(store);

// Export the configured store for use in the application
export default store;
