// Import necessary components from flowbite-react and other libraries
import { Modal, Table, Button } from 'flowbite-react'; // Components for UI
import { useEffect, useState } from 'react'; // React hooks for managing state and side effects
import { useSelector } from 'react-redux'; // Hook to access Redux store state
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Icon for the modal
import { FaCheck, FaTimes } from 'react-icons/fa'; // Icons for potential use in confirmation

// Define the DashComments functional component
export default function DashComments() {
  // Access the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  // State variables for managing comments and modal visibility
  const [comments, setComments] = useState([]); // Array to store fetched comments
  const [showMore, setShowMore] = useState(true); // Boolean to control loading more comments
  const [showModal, setShowModal] = useState(false); // Boolean to control modal visibility
  const [commentIdToDelete, setCommentIdToDelete] = useState(''); // Store ID of the comment to delete

  // useEffect to fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments from the server
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json(); // Parse JSON response

        // Check if response is OK
        if (res.ok) {
          setComments(data.comments); // Update state with fetched comments
          // If the number of comments is less than 9, hide the "Show more" button
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message); // Log any errors
      }
    };

    // Fetch comments only if the user is an admin
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]); // Dependency array to run effect when currentUser changes

  // Function to handle loading more comments
  const handleShowMore = async () => {
    const startIndex = comments.length; // Determine where to start fetching more comments
    try {
      // Fetch more comments from the server with a starting index
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json(); // Parse JSON response

      // Check if response is OK
      if (res.ok) {
        // Append new comments to the existing list
        setComments((prev) => [...prev, ...data.comments]);
        // If the number of newly fetched comments is less than 9, hide the "Show more" button
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message); // Log any errors
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async () => {
    setShowModal(false); // Hide the modal
    try {
      // Send a DELETE request to delete the specified comment
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE', // Specify the DELETE method
        }
      );
      const data = await res.json(); // Parse JSON response
      
      // Check if response is OK
      if (res.ok) {
        // Update comments state by filtering out the deleted comment
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false); // Hide the modal
      } else {
        console.log(data.message); // Log any error messages
      }
    } catch (error) {
      console.log(error.message); // Log any errors
    }
  };

  // Render the component
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {/* Check if the user is an admin and if there are comments */}
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()} {/* Format and display the comment's update date */}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell> {/* Display comment content */}
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell> {/* Display number of likes for the comment */}
                  <Table.Cell>{comment.postId}</Table.Cell> {/* Display the associated post ID */}
                  <Table.Cell>{comment.userId}</Table.Cell> {/* Display the user ID of the comment creator */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true); // Show the modal
                        setCommentIdToDelete(comment._id); // Set the comment ID to delete
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete {/* Delete action link */}
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {/* If there are more comments to show, display the "Show more" button */}
          {showMore && (
            <button
              onClick={handleShowMore} // Load more comments when clicked
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p> // Message for non-admin users or when there are no comments
      )}
      {/* Modal for confirming deletion of a comment */}
      <Modal
        show={showModal} // Show the modal if showModal is true
        onClose={() => setShowModal(false)} // Close modal on clicking outside
        popup
        size='md' // Medium size for the modal
      >
        <Modal.Header /> {/* Modal header */}
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' /> {/* Warning icon */}
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment? {/* Confirmation message */}
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}> {/* Button to confirm deletion */}
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}> {/* Button to cancel deletion */}
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
