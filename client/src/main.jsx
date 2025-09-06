// Import the necessary libraries and components
import ReactDOM from 'react-dom/client'; // Import ReactDOM to render components into the DOM
import App from './App.jsx'; // Import the main App component
import './index.css'; // Import the global CSS file for styling
import store, { persistor } from './redux/store.js'; // Import the Redux store and persistor for state management
import { Provider } from 'react-redux'; // Import Provider to connect Redux with React
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate to handle persisting the Redux state
import ThemeProvider from './components/ThemeProvider.jsx'; // Import ThemeProvider for managing theme context

// Render the root element
ReactDOM.createRoot(document.getElementById('root')).render(
  // Use PersistGate to delay the rendering of the app until the persisted state has been retrieved
  <PersistGate persistor={persistor}>
    {/* { Wrap the app in Provider to allow access to the Redux store} */}
    <Provider store={store}>
      {/* Wrap the app in ThemeProvider to provide theme context */}
      <ThemeProvider>
        {/* Render the main App component */}
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
