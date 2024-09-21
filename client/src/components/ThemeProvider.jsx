import PropTypes from 'prop-types'; // Import PropTypes
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}

// Add propTypes to validate the children prop
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is required
};
