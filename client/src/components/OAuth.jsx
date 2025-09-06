import { Button } from 'flowbite-react'; 
// Imports the 'Button' component from the 'flowbite-react' library, which is used to display styled buttons in the UI.

import { AiFillGoogleCircle } from 'react-icons/ai'; 
// Imports the Google Circle icon from the 'react-icons' library, which provides icons as React components.

import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'; 
// Imports Firebase authentication-related functions: 
// - 'GoogleAuthProvider' to configure Google as the OAuth provider,
// - 'signInWithPopup' to handle authentication via a popup window,
// - 'getAuth' to retrieve the authentication instance.

import { app } from '../firebase'; 
// Imports the Firebase app instance from a local file 'firebase', allowing access to Firebase services (e.g., authentication).

import { useDispatch } from 'react-redux'; 
// Imports the 'useDispatch' hook from 'react-redux', which allows dispatching actions to the Redux store.

import { signInSuccess } from '../redux/user/userSlice'; 
// Imports the 'signInSuccess' action creator from a Redux slice (userSlice), used to update the authentication state when sign-in is successful.

import { useNavigate } from 'react-router-dom'; 
// Imports the 'useNavigate' hook from 'react-router-dom', which allows programmatically navigating between different routes.

export default function OAuth() { 
    // Exports the 'OAuth' component as the default export of the module, representing the main functionality of the OAuth process.

    const auth = getAuth(app); 
    // Initializes Firebase authentication using the app instance and stores it in the 'auth' variable for later use.

    const dispatch = useDispatch(); 
    // Initializes the Redux dispatch function, allowing the component to dispatch actions to the Redux store.

    const navigate = useNavigate(); 
    // Initializes the 'navigate' function to enable navigation to different routes within the app.

    const handleGoogleClick = async () => { 
        // Declares an asynchronous function that will handle the click event for Google OAuth login.

        const provider = new GoogleAuthProvider(); 
        // Creates a new instance of 'GoogleAuthProvider', which sets up Google as the authentication provider.

        provider.setCustomParameters({ prompt: 'select_account' }); 
        // Sets a custom parameter for the Google OAuth popup to prompt the user to select an account each time.

        try { 
            // Starts a try-catch block to handle any potential errors during the authentication process.

            const resultsFromGoogle = await signInWithPopup(auth, provider); 
            // Initiates the Google sign-in process via a popup and waits for the user's authentication response. 'resultsFromGoogle' contains user info.

            const res = await fetch('/api/auth/google', { 
                // Makes an API request to the backend to handle Google sign-in on the server side. Waits for the response from the API.

                method: 'POST', 
                // Specifies that this API call is a POST request (used for sending data to the server).

                headers: { 'Content-Type': 'application/json' }, 
                // Sets the headers to indicate that the request body contains JSON data.

                body: JSON.stringify({ 
                    // Converts the user information into a JSON string and sends it as the body of the request.

                    name: resultsFromGoogle.user.displayName, 
                    // Extracts and sends the user's display name from the Google authentication result.

                    email: resultsFromGoogle.user.email, 
                    // Extracts and sends the user's email from the Google authentication result.

                    googlePhotoUrl: resultsFromGoogle.user.photoURL, 
                    // Extracts and sends the user's Google profile photo URL from the Google authentication result.
                }),
            });

            const data = await res.json(); 
            // Parses the JSON response from the API into a JavaScript object and stores it in the 'data' variable.

            if (res.ok) { 
                // Checks if the response status is 'ok' (successful). If true, the sign-in was successful.

                dispatch(signInSuccess(data)); 
                // Dispatches the 'signInSuccess' action to update the user state in Redux with the data received from the API.

                navigate('/'); 
                // Redirects the user to the home page ('/') upon successful sign-in and state update.
            } else { 
                // If the response is not 'ok', handles the error scenario.

                console.error('Failed to authenticate with Google'); 
                // Logs an error message in the console if the API request fails.
            }
        } catch (error) { 
            // If an error occurs during the try block (e.g., in the popup authentication or fetch call), it will be caught here.

            console.error('Error with Google OAuth:', error); 
            // Logs an error message in the console with details about the caught error.
        }
    };

    return ( 
        // Starts the JSX return statement, which defines the UI of the component.

        <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}> 
            {/* Renders a styled button from the 'flowbite-react' library with a custom appearance (gradientDuoTone), 
            outlined style, and a click handler ('handleGoogleClick') for Google OAuth login. */}

            <AiFillGoogleCircle className="w-6 h-6 mr-2" /> 
            {/* Renders the Google Circle icon inside the button with custom size (6x6) and a margin-right of 2. */}

            Continue with Google 
            {/* Displays the text "Continue with Google" next to the Google icon inside the button. */}
        </Button>
    );
}
