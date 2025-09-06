// Importing the useEffect hook from React for managing side effects in the component.
import { useEffect } from 'react';

// Importing the useLocation hook from react-router-dom to access the current location.
import { useLocation } from 'react-router-dom';

// Defining a functional component named ScrollToTop.
const ScrollToTop = () => {
  // Using the useLocation hook to get the current location object, which contains information about the current URL.
  const { pathname } = useLocation();

  // Using the useEffect hook to run a side effect whenever the pathname changes.
  useEffect(() => {
    // This will scroll the window to the top of the page (0, 0) whenever the pathname changes.
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array includes pathname, so the effect runs whenever it changes.

  // The component doesn't render anything visible to the user, hence returning null.
  return null;
};

// Exporting the ScrollToTop component as the default export of the module.
export default ScrollToTop;
