// Import necessary components and libraries
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'; // Import UI components from Flowbite
import ReactQuill from 'react-quill'; // Import rich text editor component
import 'react-quill/dist/quill.snow.css'; // Import styles for the ReactQuill component
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'; // Import Firebase storage functions for handling file uploads
import { app } from '../firebase'; // Import your Firebase app configuration
import { useEffect, useState } from 'react'; // Import React hooks for state and lifecycle management
import { CircularProgressbar } from 'react-circular-progressbar'; // Import circular progress bar component
import 'react-circular-progressbar/dist/styles.css'; // Import styles for the progress bar
import { useNavigate, useParams } from 'react-router-dom'; // Import hooks for navigation and route parameters
import { useSelector } from 'react-redux'; // Import the useSelector hook for accessing Redux store

// Define the UpdatePost component as a default export
export default function UpdatePost() {
  // State variables to manage file upload and form data
  const [file, setFile] = useState(null); // State for the selected file
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // State for upload progress
  const [imageUploadError, setImageUploadError] = useState(null); // State for upload errors
  const [formData, setFormData] = useState({}); // State for form data
  const [publishError, setPublishError] = useState(null); // State for publish errors
  const { postId } = useParams(); // Extract postId from URL parameters

  const navigate = useNavigate(); // Hook to programmatically navigate
  const { currentUser } = useSelector((state) => state.user); // Get the current user from the Redux store

  // useEffect hook to fetch the existing post data when the component mounts
  useEffect(() => {
    try {
      const fetchPost = async () => { // Define an asynchronous function to fetch post data
        const res = await fetch(`/api/post/getposts?postId=${postId}`); // Fetch the post using postId
        const data = await res.json(); // Parse the response JSON
        if (!res.ok) { // Check if the response is not ok (i.e., status code is not in the range 200-299)
          console.log(data.message); // Log the error message
          setPublishError(data.message); // Set the publish error state
          return; // Exit the function
        }
        if (res.ok) { // If the response is ok
          setPublishError(null); // Clear any existing publish error
          setFormData(data.posts[0]); // Set the form data with the fetched post data
        }
      };

      fetchPost(); // Call the fetchPost function
    } catch (error) { // Catch any errors during the fetching process
      console.log(error.message); // Log the error message
    }
  }, [postId]); // Dependency array: re-run effect if postId changes

  // Function to handle image upload
  const handleUpdloadImage = async () => {
    try {
      if (!file) { // Check if no file is selected
        setImageUploadError('Please select an image'); // Set an error message
        return; // Exit the function
      }
      setImageUploadError(null); // Clear any existing upload error
      const storage = getStorage(app); // Get the Firebase storage instance
      const fileName = new Date().getTime() + '-' + file.name; // Generate a unique filename based on current timestamp
      const storageRef = ref(storage, fileName); // Create a reference to the storage location
      const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload task

      // Monitor the state of the upload
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload progress percentage
          setImageUploadProgress(progress.toFixed(0)); // Update the progress state
        },
        (error) => {
          setImageUploadError('Image upload failed'); // Set an error message on failure
          setImageUploadProgress(null); // Clear the progress state
        },
        () => { // This function runs when the upload is complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // Get the download URL
            setImageUploadProgress(null); // Clear the progress state
            setImageUploadError(null); // Clear any existing error
            setFormData({ ...formData, image: downloadURL }); // Update formData with the new image URL
          });
        }
      );
    } catch (error) { // Catch any errors during the image upload process
      setImageUploadError('Image upload failed'); // Set an error message
      setImageUploadProgress(null); // Clear the progress state
      console.log(error); // Log the error
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT', // Specify the HTTP method as PUT for updating
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON and set as request body
      });
      const data = await res.json(); // Parse the response JSON
      if (!res.ok) { // Check if the response is not ok
        setPublishError(data.message); // Set an error message
        return; // Exit the function
      }

      if (res.ok) { // If the response is ok
        setPublishError(null); // Clear any existing publish error
        navigate(`/post/${data.slug}`); // Navigate to the updated post page using the slug from the response
      }
    } catch (error) { // Catch any errors during form submission
      setPublishError('Something went wrong'); // Set a generic error message
    }
  };   

  // Render the component
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'> {/* Container div with padding and maximum width */}
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1> {/* Title */}
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}> {/* Form element */}
        <div className='flex flex-col gap-4 sm:flex-row justify-between'> {/* Flex container for inputs */}
          <TextInput
            type='text'
            placeholder='Title' // Placeholder text
            required // Mark as required
            id='title' // Input id
            className='flex-1' // Flex grow
            onChange={(e) => // Handle input changes
              setFormData({ ...formData, title: e.target.value }) // Update formData with the new title value
            }
            value={formData.title} // Set input value from formData
          />
          <Select
            onChange={(e) => // Handle category selection
              setFormData({ ...formData, category: e.target.value }) // Update formData with the selected category
            }
            value={formData.category} // Set selected value from formData
          >
            <option value='uncategorized'>Select a category</option> {/* Default option */}
            <option value='javascript'>JavaScript</option> {/* Option for JavaScript category */}
            <option value='reactjs'>React.js</option> {/* Option for React.js category */}
            <option value='nextjs'>Next.js</option>{ /* Option for Next.js category */}
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'> {/* Container for file input and upload button */}
          <FileInput
            type='file'
            accept='image/*' // Accept only image files
            onChange={(e) => setFile(e.target.files[0])} // Update file state when an image is selected
          />
          <Button
            type='button' // Button type
            gradientDuoTone='purpleToBlue' // Set button gradient
            size='sm' // Set button size
            outline // Outline button style
            onClick={handleUpdloadImage} // Handle image upload on click
            disabled={imageUploadProgress || !file} // Disable if uploading or no file is selected
          >
            {imageUploadProgress ? ( // Conditionally render content based on upload progress
              <div className='w-16 h-16'> {/* Container for progress bar */}
                <CircularProgressbar
                  value={imageUploadProgress} // Set progress bar value
                  text={`${imageUploadProgress || 0}%`} // Display progress percentage
                />
              </div>
            ) : (
              'Upload Image' // Default button text
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>} {/* Display error message if any */}
        {formData.image && ( // Conditionally render image if formData has an image
          <img
            src={formData.image} // Set the image source to the uploaded image URL
            alt='upload' // Alternative text for the image
            className='w-full h-72 object-cover' // Styling for the image
          />
        )}
        <ReactQuill
          theme='snow' // Set the theme for the rich text editor
          value={formData.content} // Set editor value from formData
          placeholder='Write something...' // Placeholder text for the editor
          className='h-72 mb-12' // Styling for the editor
          required // Mark as required
          onChange={(value) => { // Handle changes in the editor
            setFormData({ ...formData, content: value }); // Update formData with the new content value
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'> {/* Submit button */}
          Update post {/* Button text */}
        </Button>
        {publishError && ( // Conditionally render error alert for publishing errors
          <Alert className='mt-5' color='failure'>
            {publishError} {/* Display the publish error message */}
          </Alert>
        )}
      </form>
    </div>
  );
}
