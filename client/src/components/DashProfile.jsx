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
    <div className="w-full max-w-lg p-3 mx-auto">
      {/* Header for the profile section */}
      <h1 className="text-2xl font-semibold text-center text-transparent my-7 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
        Profile
      </h1>

      {/* Form for updating user profile information */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden input for file upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        {/* Profile Picture Upload */}
        <div
          className="relative self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer border-1 border-slate-200"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-slate-900 ${imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"
              }`}
          />
        </div>

        {/* Error message for image upload */}
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}

        {/* Inputs */}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        {/* Update Button */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
          className="font-semibold text-purple-500 hover:text-white"
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {/* Admin Create Post Button */}
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full font-semibold text-white"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {/* Delete & Sign Out */}
      <div className="flex justify-between mt-5 font-medium">
        <span onClick={() => setShowModal(true)} className="text-red-500 cursor-pointer hover:text-purple-600">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer hover:text-purple-600">
          Sign Out
        </span>
      </div>

      {/* Success & Error Messages */}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5 text-gray-400">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5 text-gray-400">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5 text-gray-400">
          {error}
        </Alert>
      )}

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-cyan-400" />
            <h3 className="mb-5 text-lg text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>

  );
}


