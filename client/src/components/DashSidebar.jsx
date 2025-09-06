import { Sidebar } from 'flowbite-react'; // Import the Sidebar component from Flowbite, a UI library for React.
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi'; // Import several icons (HiUser, HiArrowSmRight, etc.) from the 'react-icons' library, specifically from the 'hi' (Heroicons) set.

import { useEffect, useState } from 'react'; // Import React hooks: useEffect (for handling side effects) and useState (for managing component state).
import { Link, useLocation } from 'react-router-dom'; // Import the Link component (for navigation) and useLocation hook (for accessing the current URL/location) from 'react-router-dom', a routing library.
import { signoutSuccess } from '../redux/user/userSlice'; // Import the 'signoutSuccess' action from the user slice in the Redux store, used for updating the user's signout status in the app state.
import { useDispatch } from 'react-redux'; // Import the useDispatch hook from 'react-redux' to allow dispatching actions to the Redux store.
import { useSelector } from 'react-redux'; // Import the useSelector hook from 'react-redux' to access the Redux store's state.

export default function DashSidebar() { // Define the DashSidebar component, which will be the default export of this file.
  const location = useLocation(); // Get the current URL location object using the useLocation hook. This allows tracking the current route for the sidebar.
  const dispatch = useDispatch(); // Get the dispatch function from the Redux store using the useDispatch hook, allowing us to dispatch actions.
  const { currentUser } = useSelector((state) => state.user); // Use useSelector to access the 'currentUser' from the 'user' state in the Redux store.

  const [tab, setTab] = useState(''); // Initialize a state variable 'tab' with an empty string to track the current active tab, and 'setTab' to update it.

  useEffect(() => { // useEffect hook runs side effects whenever the component renders or updates. Here, it listens for changes in the 'location' (URL).
    const urlParams = new URLSearchParams(location.search); // Use URLSearchParams to parse query parameters from the current URL (e.g., '?tab=profile').
    const tabFromUrl = urlParams.get('tab'); // Get the value of the 'tab' query parameter from the URL.
    if (tabFromUrl) { // If there is a 'tab' query parameter in the URL,
      setTab(tabFromUrl); // Update the 'tab' state with the value of 'tabFromUrl'.
    }
  }, [location.search]); // The useEffect hook depends on 'location.search', so it runs whenever the URL's query string changes.

  const handleSignout = async () => { // Define an asynchronous function to handle user signout.
    try {
      const res = await fetch('/api/user/signout', { // Send a POST request to the '/api/user/signout' endpoint to sign out the user.
        method: 'POST', // Define the HTTP method as 'POST'.
      });
      const data = await res.json(); // Convert the response to JSON format.
      if (!res.ok) { // If the response status is not OK (i.e., an error occurred),
        console.log(data.message); // Log the error message to the console.
      } else {
        dispatch(signoutSuccess()); // If the signout is successful, dispatch the 'signoutSuccess' action to update the Redux store's state.
      }
    } catch (error) {
      console.log(error.message); // Catch and log any errors that occur during the signout process.
    }
  };

  return ( // The return statement defines the JSX to render for this component.
    <Sidebar className='w-full md:w-56'> {/* Render the Sidebar component from Flowbite. Apply a width of full for small screens and 56 (14rem) for medium screens and up. */}
      <Sidebar.Items> {/* The Sidebar.Items component holds individual sidebar items. */}
        <Sidebar.ItemGroup className='flex flex-col gap-1'> {/* Group sidebar items together. Apply a flexbox layout with column direction and a gap of 1 between items. */}
          {currentUser && currentUser.isAdmin && ( // If there is a current user and that user is an admin, render the following block:
            <Link to='/dashboard?tab=dash'> {/* Use the Link component to navigate to the dashboard. Append '?tab=dash' to the URL. */}
              <Sidebar.Item
                active={tab === 'dash' || !tab} // Mark the item as active if the 'tab' state is 'dash' or if no tab is selected (default state).
                icon={HiChartPie} // Display the 'HiChartPie' icon next to the item.
                as='div' // Render this item as a 'div' element instead of an anchor or button (default).
              >
                Dashboard {/* Display the text 'Dashboard' inside the item. */}
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'> {/* Link to the 'profile' tab in the dashboard. */}
            <Sidebar.Item
              active={tab === 'profile'} // Mark this item as active if the 'tab' state is 'profile'.
              icon={HiUser} // Display the 'HiUser' icon.
              label={currentUser.isAdmin ? 'Admin' : 'User'} // Add a label that displays 'Admin' if the current user is an admin, otherwise 'User'.
              labelColor='dark' // Set the color of the label to 'dark'.
              as='div' // Render the item as a 'div'.
            >
              Profile {/* Display the text 'Profile'. */}
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && ( // If the current user is an admin, render the following block:
            <Link to='/dashboard?tab=posts'> {/* Link to the 'posts' tab in the dashboard. */}
              <Sidebar.Item
                active={tab === 'posts'} // Mark the item as active if the 'tab' state is 'posts'.
                icon={HiDocumentText} // Display the 'HiDocumentText' icon.
                as='div' // Render the item as a 'div'.
              >
                Posts {/* Display the text 'Posts'. */}
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && ( // If the current user is an admin, render more admin-related links:
            <>
              <Link to='/dashboard?tab=users'> {/* Link to the 'users' tab in the dashboard. */}
                <Sidebar.Item
                  active={tab === 'users'} // Mark the item as active if the 'tab' state is 'users'.
                  icon={HiOutlineUserGroup} // Display the 'HiOutlineUserGroup' icon.
                  as='div' // Render the item as a 'div'.
                >
                  Users {/* Display the text 'Users'. */}
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'> {/* Link to the 'comments' tab in the dashboard. */}
                <Sidebar.Item
                  active={tab === 'comments'} // Mark the item as active if the 'tab' state is 'comments'.
                  icon={HiAnnotation} // Display the 'HiAnnotation' icon.
                  as='div' // Render the item as a 'div'.
                >
                  Comments {/* Display the text 'Comments'. */}
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight} // Display the 'HiArrowSmRight' icon for the signout item.
            className='cursor-pointer' // Add a CSS class to change the cursor to a pointer when hovering over the item.
            onClick={handleSignout} // Attach the 'handleSignout' function to the 'onClick' event to sign out the user when clicked.
          >
            Sign Out {/* Display the text 'Sign Out'. */}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
