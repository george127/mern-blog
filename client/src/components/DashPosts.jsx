import { Modal, Table, Button } from 'flowbite-react'; // Importing UI components from Flowbite
import { useEffect, useState } from 'react'; // Importing React hooks for managing state and side effects
import { useSelector } from 'react-redux'; // Importing useSelector to access Redux store state
import { Link } from 'react-router-dom'; // Importing Link for navigation
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Importing an icon from React Icons

export default function DashPosts() {
  // Accessing current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  // State variables to manage user posts, loading state, modal visibility, and post ID for deletion
  const [userPosts, setUserPosts] = useState([]); // Array of posts for the current user
  const [showMore, setShowMore] = useState(true); // Flag to control "Show More" button visibility
  const [showModal, setShowModal] = useState(false); // Flag to control modal visibility
  const [postIdToDelete, setPostIdToDelete] = useState(''); // Post ID for the post to delete

  // Effect hook to fetch posts for the current user when the component mounts or when the user changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetching posts for the current user from the API
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json(); // Parsing the response to JSON
        
        if (res.ok) {
          setUserPosts(data.posts); // Setting the fetched posts in state
          // If less than 9 posts are fetched, hide the "Show More" button
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message); // Logging any errors during the fetch
      }
    };
    
    // Fetch posts only if the current user is an admin
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]); // Adding dependencies to run effect when they change

  // Function to handle loading more posts when "Show More" button is clicked
  const handleShowMore = async () => {
    const startIndex = userPosts.length; // Getting the current number of posts
    try {
      // Fetching additional posts from the API
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json(); // Parsing the response to JSON
      
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]); // Adding new posts to the existing list
        // If less than 9 posts are fetched, hide the "Show More" button
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message); // Logging any errors during the fetch
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async () => {
    setShowModal(false); // Closing the modal
    try {
      // Sending DELETE request to remove the selected post
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE', // Specifying the method as DELETE
        }
      );
      const data = await res.json(); // Parsing the response to JSON
      
      if (!res.ok) {
        console.log(data.message); // Logging the error message if the response is not okay
      } else {
        // Updating the state to remove the deleted post from the list
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message); // Logging any errors during the fetch
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {/* Check if the current user is an admin */}
      {currentUser.isAdmin ? (
        userPosts.length > 0 ? (
          <>
            {/* Table to display user posts */}
            <Table hoverable className='shadow-md'>
              <Table.Head>
                {/* Table headers for different post attributes */}
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
                {/* Mapping over userPosts to create a table row for each post */}
                {userPosts.map((post) => (
                  <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {/* Formatting the date of the post */}
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {/* Link to the post with the post image */}
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image} // Image source for the post
                          alt={post.title} // Alt text for accessibility
                          className='w-20 h-10 object-cover bg-gray-500' // Styling for the image
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {/* Link to the post title */}
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/post/${post.slug}`}
                      >
                        {post.title} {/* Displaying the post title */}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell> {/* Displaying the post category */}
                    <Table.Cell>
                      {/* Clickable text to set the post ID for deletion and show the modal */}
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id); // Storing post ID to delete
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {/* Link to the edit post page */}
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/update-post/${post._id}`}
                      >
                        Edit
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {/* Show more button if there are more posts to load */}
            {showMore && (
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>Loading posts...</p> // Message while posts are being fetched
        )
      ) : (
        <p>You have no posts yet!</p> // Message for non-admin users with no posts
      )}
      {/* Modal for confirming post deletion */}
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
            {/* Confirmation message for post deletion */}
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            {/* Buttons for confirming or canceling post deletion */}
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
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
