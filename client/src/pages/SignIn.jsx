// Import necessary components and libraries
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'; // Import UI components from Flowbite
import { useState } from 'react'; // Import useState hook for state management
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for programmatic navigation
import { useDispatch, useSelector } from 'react-redux'; // Import hooks for managing state with Redux
import {
  signInStart, // Action for starting sign-in
  signInSuccess, // Action for successful sign-in
  signInFailure, // Action for failed sign-in
} from '../redux/user/userSlice'; // Import Redux actions from userSlice
import OAuth from '../components/OAuth'; // Import OAuth component for signing in with third-party services

// Define the SignIn component as a default export
export default function SignIn() {
  // State variables for managing form data
  const [formData, setFormData] = useState({}); // State to hold form data
  const { loading, error: errorMessage } = useSelector((state) => state.user); // Get loading state and error message from Redux store
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const navigate = useNavigate(); // Hook to enable programmatic navigation

  // Function to handle input changes and update formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); // Update formData with trimmed input value
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if all required fields are filled
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields')); // Dispatch failure action if fields are missing
    }

    try {
      dispatch(signInStart()); // Dispatch action to indicate sign-in has started
      const res = await fetch('/api/auth/signin', {
        method: 'POST', // Specify the HTTP method as POST
        headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
        body: JSON.stringify(formData), // Convert formData to JSON and set as request body
      });

      const data = await res.json(); // Parse the response JSON

      // Check if the response indicates failure
      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Dispatch failure action with error message
      }

      // If the response is OK, dispatch success action and navigate to the homepage
      if (res.ok) {
        dispatch(signInSuccess(data)); // Dispatch success action with user data
        navigate('/'); // Navigate to the homepage
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch failure action in case of an error
    }
  };

  // Render the component
  return (
    <div className='min-h-screen mt-20'> {/* Container with minimum height */}
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'> {/* Flex container for layout */}
        {/* Left section */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'> {/* Logo link */}
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Sahand&apos;s
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'> {/* Description text */}
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>

        {/* Right section */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}> {/* Form element */}
            <div>
              <Label value='Your email' /> {/* Label for email */}
              <TextInput
                type='email'
                placeholder='name@company.com' // Placeholder text
                id='email' // Input id
                onChange={handleChange} // Handle input changes
              />
            </div>
            <div>
              <Label value='Your password' /> {/* Label for password */}
              <TextInput
                type='password'
                placeholder='**********' // Placeholder text
                id='password' // Input id
                onChange={handleChange} // Handle input changes
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink' // Button gradient color
              type='submit' // Button type
              disabled={loading} // Disable button when loading
            >
              {loading ? ( // Conditional rendering for button text based on loading state
                <>
                  <Spinner size='sm' /> {/* Spinner for loading state */}
                  <span className='pl-3'>Loading...</span> {/* Loading text */}
                </>
              ) : (
                'Sign In' // Default button text
              )}
            </Button>
            <OAuth /> {/* OAuth component for signing in with Google or other providers */}
          </form>

          {/* Link to sign up if the user doesn't have an account */}
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don&apos;t Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'> {/* Sign up link */}
              Sign Up
            </Link>
          </div>

          {/* Display error message if any */}
          {errorMessage && (
            <Alert className='mt-5' color='failure'> {/* Alert component for error messages */}
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
