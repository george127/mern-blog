// Importing PropTypes for type-checking the props of the component.
import PropTypes from 'prop-types'; 

// Importing the useSelector hook from React Redux to access the Redux store state.
import { useSelector } from 'react-redux';

// Defining a functional component named ThemeProvider that takes children as props.
export default function ThemeProvider({ children }) {
  
  // Using useSelector to access the theme from the Redux store state.
  // It destructures the theme property from the state.theme object.
  const { theme } = useSelector((state) => state.theme);
  
  return (
    // The outer div's class name is set to the value of the theme, 
    // which allows for dynamic theming based on the Redux state.
    <div className={theme}>
      
      {/* 
      This inner div has the following classes:
      - 'bg-white': Sets the background color to white in light mode.
      - 'text-gray-700': Sets the text color to gray-700 in light mode.
      - 'dark:text-gray-200': Sets the text color to gray-200 in dark mode.
      - 'dark:bg-[rgb(16,23,42)]': Sets the background color for dark mode to a specific RGB value.
      - 'min-h-screen': Ensures the div takes at least the full height of the screen.
      */}
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        
        {/* Render the children prop here, which allows any nested components or elements to be displayed */}
        {children}
      </div>
    </div>
  );
}

// Defining prop types for the ThemeProvider component to enforce type checking.
// This specifies that 'children' is required and must be a valid React node (element).
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};
