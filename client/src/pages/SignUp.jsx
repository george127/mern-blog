// Import necessary components and libraries
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'; // Import UI components from Flowbite
import { useState } from 'react'; // Import useState hook for state management
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for programmatic navigation
import OAuth from '../components/OAuth'; // Import OAuth component for signing up with third-party services

// Define the SignUp component as a default export
export default function SignUp() {
  // State variables for managing form data, error messages, and loading state
  const [formData, setFormData] = useState({}); // State to hold form data
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // Hook to enable programmatic navigation

  // Function to handle input changes and update formData
  const handleChange = (e) => {
setFormData({ ...formData, [e.target.id]: e.target.value.trim(), isAdmin: true });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if all required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.'); // Set error message if fields are missing
    }

    try {
      setLoading(true); // Set loading state to true
      setErrorMessage(null); // Clear any previous error messages

      // Send POST request to the API to create a new user
      const res = await fetch('/api/auth/signup', {
        method: 'POST', // Specify the HTTP method as POST
        headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
        body: JSON.stringify(formData), // Convert formData to JSON and set as request body
      });

      const data = await res.json(); // Parse the response JSON

      // Check if the response indicates failure
      if (data.success === false) {
        return setErrorMessage(data.message); // Set error message if signup fails
      }

      setLoading(false); // Set loading state to false after the request completes

      // If response is OK, navigate to the sign-in page
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message); // Set error message in case of a catch
      setLoading(false); // Set loading state to false
    }
  };

  // Render the component
  return (
    <div className='min-h-screen mt-20'> {/* Container with minimum height */}
      <div className='flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row md:items-center'> {/* Flex container for layout */}
        {/* Left section */}
        <div className='flex-1'>
          <Link to='/' className='text-4xl font-bold dark:text-white'> {/* Logo link */}
            <span className='px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
              Geo&apos;s
            </span>
            Blog
          </Link>
          <p className='mt-5 text-sm'> {/* Description text */}
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>

        {/* Right section */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}> {/* Form element */}
            <div>
              <Label value='Your username' /> {/* Label for username */}
              <TextInput
                type='text'
                placeholder='Username' // Placeholder text
                id='username' // Input id
                onChange={handleChange} // Handle input changes
              />
            </div>
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
                placeholder='Password' // Placeholder text
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
                'Sign Up' // Default button text
              )}
            </Button>
            <OAuth /> {/* OAuth component for signing up with Google or other providers */}
          </form>

          {/* Link to sign in if the user already has an account */}
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'> {/* Sign in link */}
              Sign In
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
