
// Import required components and libraries
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"; // UI components from Flowbite React
import ReactQuill from "react-quill"; // WYSIWYG rich text editor for post content
import "react-quill/dist/quill.snow.css"; // Import default Quill theme
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Firebase storage functions
import { app } from "../firebase"; // Firebase configuration (assumed from 'firebase.js')
import { useState } from "react"; // React hooks for state management
import { CircularProgressbar } from "react-circular-progressbar"; // Progress bar for image upload
import "react-circular-progressbar/dist/styles.css"; // Styles for the progress bar
import { useNavigate } from "react-router-dom"; // Navigation hook for redirecting after post creation

export default function CreatePost() {
  // Declare state variables
  const [file, setFile] = useState(null); // Stores the selected file for image upload
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Tracks the image upload progress percentage
  const [imageUploadError, setImageUploadError] = useState(null); // Tracks errors during image upload
  const [formData, setFormData] = useState({}); // Stores form data including title, category, content, and uploaded image URL
  const [publishError, setPublishError] = useState(null); // Tracks errors during post publishing

  const navigate = useNavigate(); // Used for redirecting to the newly created post

  // Function to handle image upload to Firebase storage
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image"); // Error if no file is selected
        return;
      }
      setImageUploadError(null); // Clear previous errors
      const storage = getStorage(app); // Initialize Firebase storage
      const fileName = new Date().getTime() + "-" + file.name; // Create unique file name based on timestamp
      const storageRef = ref(storage, fileName); // Create a reference for the file in Firebase
      const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload task

      // Listen for upload progress and errors
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate and update the upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0)); // Round progress to an integer
        },
        (error) => {
          setImageUploadError("Image upload failed"); // Handle errors during upload
          setImageUploadProgress(null);
        },
        () => {
          // After a successful upload, get the download URL for the image
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null); // Reset progress state
            setImageUploadError(null); // Clear any errors
            setFormData({ ...formData, image: downloadURL }); // Add the image URL to form data
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed"); // Handle any unexpected errors
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // Function to handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message); // Display an error if the server responds with an error
        return;
      }

      if (res.ok) {
        setPublishError(null); // Clear any publish errors
        navigate(`/post/${data.slug}`); // Redirect to the newly created post page using its slug
      }
    } catch (error) {
      setPublishError("Something went wrong"); // Handle any unexpected errors
    }
  };

  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a post</h1>
      {/* Form for creating a post */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title and category selection */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={
              (e) => setFormData({ ...formData, title: e.target.value }) // Update form data with the title
            }
          />
          <Select
            onChange={
              (e) => setFormData({ ...formData, category: e.target.value }) // Update form data with the selected category
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* Image upload section */}
        <div className="flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])} // Set the selected file
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress} // Disable the button if an upload is in progress
          >
            {imageUploadProgress ? (
              // Show progress bar if an upload is in progress
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image" // Show this text if no upload is in progress
            )}
          </Button>
        </div>

        {/* Display image upload error if any */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Preview the uploaded image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="object-cover w-full h-72"
          />
        )}

        {/* Rich text editor for post content */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="mb-12 h-72"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value }); // Update form data with the post content
          }}
        />

        {/* Submit button */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>

        {/* Display publishing error if any */}
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
