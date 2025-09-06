import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react'; // Importing UI components from Flowbite for alerts, buttons, modals, and text areas.
import { useEffect, useState } from 'react'; // Importing React hooks for state management and lifecycle methods.
import { useSelector } from 'react-redux'; // Importing useSelector to access Redux state.
import { Link, useNavigate } from 'react-router-dom'; // Importing Link for routing and useNavigate for navigation.
import Comment from './Comment'; // Importing the Comment component to render individual comments.
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Importing an icon for visual representation in the modal.

export default function CommentSection({ postId }) {
  // Defining the CommentSection component that takes postId as a prop.

  const { currentUser } = useSelector((state) => state.user); // Accessing the currentUser from the Redux store.
  const [comment, setComment] = useState(''); // State to manage the current comment input.
  const [commentError, setCommentError] = useState(null); // State to manage any comment submission error.
  const [comments, setComments] = useState([]); // State to manage the list of comments.
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the delete confirmation modal.
  const [commentToDelete, setCommentToDelete] = useState(null); // State to keep track of the comment that the user wants to delete.
  const navigate = useNavigate(); // Using the navigate function for programmatic navigation.

  // Function to handle comment submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    if (comment.length > 200) {
      return; // If the comment exceeds 200 characters, do nothing.
    }
    try {
      // Sending a POST request to create a new comment.
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment, // Comment content
          postId, // ID of the post the comment is associated with
          userId: currentUser._id, // ID of the user submitting the comment
        }),
      });
      const data = await res.json(); // Parsing the response data as JSON.
      if (res.ok) {
        // If the response is successful:
        setComment(''); // Clear the comment input field.
        setCommentError(null); // Reset any comment error.
        setComments([data, ...comments]); // Add the new comment to the beginning of the comments list.
      }
    } catch (error) {
      setCommentError(error.message); // If an error occurs, set the comment error state.
    }
  };

  // useEffect to fetch comments when the component mounts or when postId changes.
  useEffect(() => {
    const getComments = async () => {
      try {
        // Fetching comments associated with the post.
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json(); // Parsing the response data.
          setComments(data); // Setting the fetched comments into state.
        }
      } catch (error) {
        console.log(error.message); // Logging any error that occurs during fetch.
      }
    };
    getComments(); // Calling the function to fetch comments.
  }, [postId]); // Dependency array includes postId, so the effect runs when it changes.

  // Function to handle liking a comment.
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        // If user is not logged in, navigate to the sign-in page.
        navigate('/sign-in');
        return;
      }
      // Sending a PUT request to like a comment.
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json(); // Parsing the response data.
        // Updating the comments state with the new like information.
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes, // Updating likes array
                  numberOfLikes: data.likes.length, // Updating number of likes
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message); // Logging any error that occurs during fetch.
    }
  };

  // Function to handle editing a comment.
  const handleEdit = async (comment, editedContent) => {
    // Updating the comments state with the edited content.
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  // Function to handle deleting a comment.
  const handleDelete = async (commentId) => {
    setShowModal(false); // Closing the delete confirmation modal.
    try {
      if (!currentUser) {
        navigate('/sign-in'); // If user is not logged in, navigate to the sign-in page.
        return;
      }
      // Sending a DELETE request to delete a comment.
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json(); // Parsing the response data.
        // Filtering out the deleted comment from the comments state.
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message); // Logging any error that occurs during fetch.
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        // If user is signed in, display their username and profile picture.
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt='Profile'
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        // If user is not signed in, prompt them to sign in.
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        // Render the comment input form if the user is signed in.
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)} // Update the comment state on change.
            value={comment} // Controlled input.
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {commentError && (
            // Display error message if there's an error with comment submission.
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        // If there are no comments, display a message indicating so.
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p> {/* Display the total number of comments. */}
            </div>
          </div>
          {comments.map((comment) => (
            // Map through the comments array to render each Comment component.
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike} // Pass down the like handler.
              onEdit={handleEdit} // Pass down the edit handler.
              onDelete={(commentId) => {
                setShowModal(true); // Show the modal for confirmation.
                setCommentToDelete(commentId); // Set the comment ID to be deleted.
              }}
            />
          ))}
        </>
      )}
      {/* Modal for delete confirmation */}
      <Modal
        show={showModal} // Control the modal's visibility.
        onClose={() => setShowModal(false)} // Close modal handler.
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)} // Confirm delete action.
              >
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
