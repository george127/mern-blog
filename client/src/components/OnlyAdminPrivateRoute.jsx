// Importing necessary hooks and components from React Redux and React Router.
import { useSelector } from 'react-redux'; // This hook allows access to the Redux store's state.
import { Outlet, Navigate } from 'react-router-dom'; // Outlet renders child routes; Navigate is used for navigation.

export default function OnlyAdminPrivateRoute() {
  // Using useSelector to access the currentUser from the Redux store state.
  const { currentUser } = useSelector((state) => state.user);
  
  // Checking if the currentUser exists and is an admin.
  return currentUser && currentUser.isAdmin ? (
    // If the user is an admin, render the nested routes.
    <Outlet />
  ) : (
    // If the user is not an admin, redirect them to the sign-in page.
    <Navigate to='/sign-in' />
  );
}
