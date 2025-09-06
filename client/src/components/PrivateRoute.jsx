// Importing the useSelector hook from react-redux to access the Redux state.
import { useSelector } from 'react-redux';

// Importing the Outlet and Navigate components from react-router-dom for routing purposes.
import { Outlet, Navigate } from 'react-router-dom';

// Defining a functional component named PrivateRoute.
export default function PrivateRoute() {
  // Using the useSelector hook to access the currentUser from the Redux store.
  const { currentUser } = useSelector((state) => state.user);

  // Returning the Outlet component if there is a currentUser, otherwise redirecting to the '/sign-in' page.
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
