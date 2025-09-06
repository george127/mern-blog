import moment from 'moment'; // Importing moment.js for date formatting.
import { useEffect, useState } from 'react'; // Importing React hooks for state and lifecycle management.
import { FaThumbsUp } from 'react-icons/fa'; // Importing thumbs up icon from react-icons.
import { useSelector } from 'react-redux'; // Importing useSelector to access the Redux store state.
import { Button, Textarea } from 'flowbite-react'; // Importing UI components from Flowbite for buttons and text areas.

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  // Comment component that takes a comment object and functions to handle like, edit, and delete actions.

  const [user, setUser] = useState({}); // State to hold the user information.
  const [isEditing, setIsEditing] = useState(false); // State to track if the comment is being edited.
  const [editedContent, setEditedContent] = useState(comment.content); // State for the edited comment content.
  const { currentUser } = useSelector((state) => state.user); // Accessing the current user from the Redux store.

  // useEffect to fetch the user information associated with the comment when the comment prop changes.
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`); // Fetching user data based on userId from the comment.
        const data = await res.json(); // Parsing the response to JSON.
        if (res.ok) {
          setUser(data); // If the fetch is successful, update the user state with the fetched data.
        }
      } catch (error) {
        console.log(error.message); // Logging any errors that occur during the fetch.
      }
    };
    getUser(); // Calling the function to fetch user data.
  }, [comment]); // Dependency array includes comment to refetch when the comment prop changes.

  // Function to initiate editing of the comment.
  const handleEdit = () => {
    setIsEditing(true); // Set editing mode to true.
    setEditedContent(comment.content); // Populate the editedContent state with the current comment content.
  };

  // Function to save the edited comment.
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT', // Sending a PUT request to edit the comment.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent, // Send the edited content.
        }),
      });
      if (res.ok) {
        setIsEditing(false); // Exit editing mode.
        onEdit(comment, editedContent); // Call the onEdit callback with the updated content.
      }
    } catch (error) {
      console.log(error.message); // Logging any errors that occur during the save operation.
    }
  };

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'> 
      {/* Container for the comment, styled with padding and border. */}
      <div className='flex-shrink-0 mr-3'> 
        {/* User profile picture section */}
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture} // Display user's profile picture.
          alt={user.username} // Alt text for accessibility.
        />
      </div>
      <div className='flex-1'> 
        {/* Main content area for the comment */}
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'} 
            {/* Display username or 'anonymous user' if user data is not available */}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()} 
            {/* Display the time since the comment was created using moment.js */}
          </span>
        </div>
        {isEditing ? (
          <>
            {/* If in editing mode, show the textarea and save/cancel buttons */}
            <Textarea
              className='mb-2'
              value={editedContent} // Controlled input for edited content.
              onChange={(e) => setEditedContent(e.target.value)} // Update the edited content on change.
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave} // Save changes on click.
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(false)} // Cancel editing on click.
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* If not in editing mode, show the comment content and action buttons */}
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(comment._id)} // Call the onLike function when liked.
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500' // Change color if the current user has liked the comment.
                }`}
              >
                <FaThumbsUp className='text-sm' /> {/* Thumbs up icon */}
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                {/* Display the number of likes, adjusting for singular/plural */}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    {/* Show edit and delete buttons if the user is the owner of the comment or an admin */}
                    <button
                      type='button'
                      onClick={handleEdit} // Call handleEdit function to edit the comment.
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)} // Call the onDelete function when clicked.
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
