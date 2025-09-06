// Importing necessary components and libraries from Flowbite, React Router, React Redux, and React.
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'; // UI components from Flowbite.
import { Link, useLocation, useNavigate } from 'react-router-dom'; // React Router components for navigation.
import { AiOutlineSearch } from 'react-icons/ai'; // Icon for search functionality.
import { FaMoon, FaSun } from 'react-icons/fa'; // Icons for theme toggling.
import { useSelector, useDispatch } from 'react-redux'; // Hooks for accessing Redux state and dispatching actions.
import { toggleTheme } from '../redux/theme/themeSlice'; // Action to toggle the theme from the Redux slice.
import { signoutSuccess } from '../redux/user/userSlice'; // Action to handle sign-out from the Redux slice.
import { useEffect, useState } from 'react'; // Hooks for managing component state and side effects.

export default function Header() {
  // Get the current path and location from React Router.
  const path = useLocation().pathname; // Extracting the current pathname for active link highlighting.
  const location = useLocation(); // Getting the location object to access query parameters.
  const navigate = useNavigate(); // Function to programmatically navigate to different routes.
  const dispatch = useDispatch(); // Function to dispatch actions to the Redux store.
  
  // Accessing the current user and theme from the Redux store.
  const { currentUser } = useSelector((state) => state.user); // Getting the current user state.
  const { theme } = useSelector((state) => state.theme); // Getting the current theme state.
  
  // State variable for the search term input.
  const [searchTerm, setSearchTerm] = useState(''); // Initializing state for search term with an empty string.

  // Effect hook to check for search term in URL query parameters on location change.
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Creating a URLSearchParams object from the current URL.
    const searchTermFromUrl = urlParams.get('searchTerm'); // Extracting the 'searchTerm' parameter from the URL.
    // If the search term exists in the URL, update the state variable.
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Updating the search term state with the value from URL.
    }
  }, [location.search]); // Effect runs whenever the search query in the URL changes.

  // Function to handle user sign-out.
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST', // Making a POST request to the sign-out API endpoint.
      });
      const data = await res.json(); // Parsing the response data to JSON format.
      // Check if the response is not okay, log the error message.
      if (!res.ok) {
        console.log(data.message); // Log any error messages returned from the server.
      } else {
        // If the sign-out was successful, dispatch the signoutSuccess action to update the Redux state.
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message); // Log any errors that occurred during the fetch request.
    }
  };

  // Function to handle the search form submission.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    const urlParams = new URLSearchParams(location.search); // Creating a new URLSearchParams object from the current URL.
    urlParams.set('searchTerm', searchTerm); // Setting the search term in the URL parameters.
    const searchQuery = urlParams.toString(); // Converting the parameters to a query string.
    navigate(`/search?${searchQuery}`); // Navigating to the search page with the search query.
  };

  // Rendering the header component with a navigation bar.
  return (
    <Navbar className='border-b-2'> {/* Creating a Navbar component with a bottom border.*/}
      <Link
        to='/' // Link to navigate to the home page.
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white' // Styling the link.
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'> {/* Gradient background for the blog title.*/}
          Sahand&apos;s
        </span>
        Blog {/* Blog title text.*/}
      </Link>
      <form onSubmit={handleSubmit}> {/* Form for search functionality.*/}
        <TextInput
          type='text' // Input type is text for searching.
          placeholder='Search...' // Placeholder text for the input field.
          rightIcon={AiOutlineSearch} // Icon displayed on the right side of the input.
          className='hidden lg:inline' // Hiding the input on smaller screens, showing on large screens.
          value={searchTerm} // Binding the input value to the searchTerm state.
          onChange={(e) => setSearchTerm(e.target.value)} // Updating searchTerm state on input change.
        />
      </form>
      {/* Button for search functionality on smaller screens.*/}
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch /> {/* Search icon displayed on the button.*/}
      </Button>
      <div className='flex gap-2 md:order-2'> {/* Container for user actions and theme toggle.*/}
        {/* Button to toggle between light and dark themes.*/}
        <Button
          className='w-12 h-10 hidden sm:inline' // Showing button only on small screens and larger.
          color='gray' // Button color is gray.
          pill // Button has rounded edges.
          onClick={() => dispatch(toggleTheme())} // Dispatch toggleTheme action on click.
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />} {/* Conditional rendering of icons based on the current theme.*/}
        </Button>
        {currentUser ? ( // Conditional rendering based on whether a user is signed in.
          <Dropdown // Dropdown for user actions.
            arrowIcon={false} // Hiding the dropdown arrow icon.
            inline // Making the dropdown display inline.
            label={ // Label for the dropdown, showing user's avatar.
              <Avatar alt='user' img={currentUser.profilePicture} rounded /> // User's avatar from the Redux state.
            }
          >
            <Dropdown.Header> {/* Header of the dropdown.*/}
              <span className='block text-sm'>@{currentUser.username}</span> {/* Displaying the user's username.*/}
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span> {/* Displaying the user's email with truncation.*/}
            </Dropdown.Header>
            {/* Link to the profile page.*/}
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item> {/* Dropdown item for navigating to the profile.*/}
            </Link>
            <Dropdown.Divider /> {/* Divider between dropdown items.*/}
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item> {/* Dropdown item to sign out the user.*/}
          </Dropdown>
        ) : ( // If no user is signed in, show the sign-in button.
          <Link to='/sign-in'> {/* Link to the sign-in page.*/}
            <Button gradientDuoTone='purpleToBlue' outline> {/* Sign-in button with gradient color.*/}
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle /> {/* Button to toggle the display of the Navbar on smaller screens.*/}
      </div>
      <Navbar.Collapse> {/* Collapsible section for additional links.*/}
        <Navbar.Link active={path === '/'} as={'div'}> {/* Link to the home page with active state.*/}
          <Link to='/'>Home</Link> {/* Home link.*/}
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}> {/* Link to the about page with active state.*/}
          <Link to='/about'>About</Link> {/* About link.*/}
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}> {/* Link to the projects page with active state.*/}
          <Link to='/projects'>Projects</Link> {/* Projects link.*/}
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
