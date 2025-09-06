// Importing various components and hooks from external libraries
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react'; // UI components from flowbite-react
import { useEffect, useRef, useState } from 'react'; // React hooks for state management and lifecycle methods
import { useSelector } from 'react-redux'; // Hook to access Redux store's state
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'; // Firebase storage functions for file uploads and getting file URLs
import { app } from '../firebase'; // Firebase configuration file
import { CircularProgressbar } from 'react-circular-progressbar'; // Component to show upload progress as a circular progress bar
import 'react-circular-progressbar/dist/styles.css'; // CSS styles for the circular progress bar
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice'; // Redux action creators for updating user, deleting user, and signing out
import { useDispatch } from 'react-redux'; // Hook to dispatch Redux actions
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Icon from react-icons library
import { Link } from 'react-router-dom'; // For navigation in a React Router application

export default function DashProfile() {
  // Accessing user-related state from the Redux store
  const { currentUser, error, loading } = useSelector((state) => state.user);

  // Defining local state variables using React's useState hook
  const [imageFile, setImageFile] = useState(null); // Holds the selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // URL of the image for display
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Tracks the upload progress percentage
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Stores any upload errors
  const [imageFileUploading, setImageFileUploading] = useState(false); // Flag for whether an image is currently uploading
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // Stores success message after updating user profile
  const [updateUserError, setUpdateUserError] = useState(null); // Stores error message after failing to update user profile
  const [showModal, setShowModal] = useState(false); // Controls visibility of a confirmation modal
  const [formData, setFormData] = useState({}); // Holds form data for updating user profile

  // useRef hook to reference the file input element without re-rendering the component
  const filePickerRef = useRef();

  // Hook to dispatch actions to the Redux store
  const dispatch = useDispatch();

  // Function to handle when the user selects an image file for upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected
    if (file) {
      setImageFile(file); // Set the selected file in state
      setImageFileUrl(URL.createObjectURL(file)); // Create a local URL to display the image
    }
  };

  // useEffect hook that triggers the image upload whenever the imageFile state changes
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Call the uploadImage function when a new image is selected
    }
  }, [imageFile]); // Dependency array ensures this effect runs only when imageFile changes

  // Function to handle image upload to Firebase Storage
  const uploadImage = async () => {
    setImageFileUploading(true); // Set uploading flag to true
    setImageFileUploadError(null); // Reset any previous errors
    const storage = getStorage(app); // Get a reference to Firebase storage using app configuration
    const fileName = new Date().getTime() + imageFile.name; // Create a unique filename with a timestamp
    const storageRef = ref(storage, fileName); // Create a reference to the file's storage location
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Begin the file upload task

    // Monitor the state of the file upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload progress

        setImageFileUploadProgress(progress.toFixed(0)); // Update progress in state
      },
      () => {
        // Handle errors during the upload
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null); // Reset progress
        setImageFile(null); // Clear the file
        setImageFileUrl(null); // Clear the image URL
        setImageFileUploading(false); // Stop showing uploading state
      },
      () => {
        // When the upload is complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Set the download URL in state
          setFormData({ ...formData, profilePicture: downloadURL }); // Add the image URL to the form data
          setImageFileUploading(false); // Stop showing uploading state
        });
      }
    );
  };

  // Function to handle changes to form fields (like name, email, etc.)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // Update the form data with the new field value
  };

  // Function to handle form submission for updating user profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setUpdateUserError(null); // Reset any previous errors
    setUpdateUserSuccess(null); // Reset any previous success messages
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made'); // Show error if no changes were made
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload'); // Show error if image upload is still in progress
      return;
    }
    try {
      dispatch(updateStart()); // Dispatch an action to indicate the update process has started
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT', // Use the PUT method to update the user data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the updated form data in the request body
      });
      const data = await res.json(); // Parse the response data
      if (!res.ok) {
        dispatch(updateFailure(data.message)); // Dispatch failure action if the request failed
        setUpdateUserError(data.message); // Set the error message in state
      } else {
        dispatch(updateSuccess(data)); // Dispatch success action if the request succeeded
        setUpdateUserSuccess("User's profile updated successfully"); // Show success message in state
      }
    } catch (error) {
      dispatch(updateFailure(error.message)); // Handle any errors during the request
      setUpdateUserError(error.message); // Set the error message in state
    }
  };

  // Function to handle deleting the user's profile
  const handleDeleteUser = async () => {
    setShowModal(false); // Close the confirmation modal
    try {
      dispatch(deleteUserStart()); // Dispatch an action to indicate the delete process has started
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE', // Use the DELETE method to remove the user data
      });
      const data = await res.json(); // Parse the response data
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message)); // Dispatch failure action if the request failed
      } else {
        dispatch(deleteUserSuccess(data)); // Dispatch success action if the request succeeded
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Handle any errors during the request
    }
  };

  // Function to handle user signout
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST', // Use the POST method to sign out the user
      });
      const data = await res.json(); // Parse the response data
      if (!res.ok) {
        console.log(data.message); // Log any error messages
      } else {
        dispatch(signoutSuccess()); // Dispatch a success action when the user successfully signs out
      }
    } catch (error) {
      console.log(error.message); // Log any errors
    }
  };

  return (
    // Main container for the profile page with responsive width and padding
    <div className='max-w-lg mx-auto p-3 w-full'>
      {/* Header for the profile section */}
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      {/* Form for updating user profile information */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Input for file upload, hidden by default, only accepts image files */}
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange} // Event handler for when an image is selected
          ref={filePickerRef} // Reference for the input to trigger a click
          hidden // Hides the file input element
        />
        {/* Container for the user's profile picture with click functionality to trigger file picker */}
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()} // Click opens the file picker
        >
          {/* Circular progress bar to show upload progress */}
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0} // Sets the progress value
              text={`${imageFileUploadProgress}%`} // Displays the percentage
              strokeWidth={5} // Width of the progress stroke
              styles={{
                root: {
                  width: '100%', // Full width of the container
                  height: '100%', // Full height of the container
                  position: 'absolute', // Absolute positioning for layering
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`, // Color of the progress path based on progress
                },
              }}
            />
          )}
          {/* Image display for user profile picture, showing either uploaded or current user's picture */}
          <img
            src={imageFileUrl || currentUser.profilePicture} // Source for the image, either uploaded or current
            alt='user' // Alt text for accessibility
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 && // Reduces opacity while uploading
              'opacity-60'
            }`}
          />
        </div>
        {/* Displays error message for image upload, if any */}
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        {/* Input field for username with default value from current user */}
        <TextInput
          type='text'
          id='username' // Unique identifier for the input
          placeholder='username' // Placeholder text for the input
          defaultValue={currentUser.username} // Default value set to current user's username
          onChange={handleChange} // Event handler for input changes
        />
        {/* Input field for email with default value from current user */}
        <TextInput
          type='email'
          id='email' // Unique identifier for the input
          placeholder='email' // Placeholder text for the input
          defaultValue={currentUser.email} // Default value set to current user's email
          onChange={handleChange} // Event handler for input changes
        />
        {/* Input field for password with no default value */}
        <TextInput
          type='password'
          id='password' // Unique identifier for the input
          placeholder='password' // Placeholder text for the input
          onChange={handleChange} // Event handler for input changes
        />
        {/* Button to submit the form for updating user information */}
        <Button
          type='submit' // Specifies the button type as submit
          gradientDuoTone='purpleToBlue' // Button color gradient
          outline // Outline style for the button
          disabled={loading || imageFileUploading} // Button is disabled if loading or uploading
        >
          {loading ? 'Loading...' : 'Update'} {/* Button text changes based on loading state */}
        </Button>
        {/* Button to create a post, visible only for admin users */}
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button' // Specifies the button type as button
              gradientDuoTone='purpleToPink' // Button color gradient
              className='w-full' // Full width for the button
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      {/* Container for delete account and sign out options */}
      <div className='text-red-500 flex justify-between mt-5'>
        {/* Clickable text to show modal for account deletion */}
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>
        {/* Clickable text to sign out user */}
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {/* Displays success message for user updates, if any */}
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {/* Displays error message for user updates, if any */}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {/* Displays error message for other errors, if any */}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      {/* Modal for confirming account deletion */}
      <Modal
        show={showModal} // Controls visibility of the modal
        onClose={() => setShowModal(false)} // Closes the modal on close action
        popup // Makes the modal look like a popup
        size='md' // Sets the size of the modal
      >
        <Modal.Header /> {/* Header for the modal, empty for this case */}
        <Modal.Body>
          <div className='text-center'>
            {/* Icon indicating caution or warning */}
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            {/* Confirmation message for account deletion */}
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            {/* Buttons for confirming or canceling account deletion */}
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );  
}

  
