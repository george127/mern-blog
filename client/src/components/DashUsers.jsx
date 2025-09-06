// Importing necessary components and hooks from Flowbite, React, and React Redux.
import { Modal, Table, Button } from 'flowbite-react'; // Importing UI components from Flowbite.
import { useEffect, useState } from 'react'; // Importing hooks for component state and lifecycle management.
import { useSelector } from 'react-redux'; // Importing the useSelector hook to access Redux state.
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Importing icons for UI.
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importing icons for indicating admin status.

export default function DashUsers() { // Declaring the DashUsers functional component.
  // Selecting the current user from Redux state.
  const { currentUser } = useSelector((state) => state.user); 

  // State variables to manage users list, modal visibility, and user to delete.
  const [users, setUsers] = useState([]); // State to store the list of users.
  const [showMore, setShowMore] = useState(true); // State to toggle "Show More" button visibility.
  const [showModal, setShowModal] = useState(false); // State to toggle delete confirmation modal visibility.
  const [userIdToDelete, setUserIdToDelete] = useState(''); // State to store the ID of the user to delete.

  // useEffect hook to fetch users when the component mounts or when currentUser changes.
  useEffect(() => {
    const fetchUsers = async () => { // Asynchronous function to fetch users from the API.
      try {
        const res = await fetch(`/api/user/getusers`); // Fetching users from the API.
        const data = await res.json(); // Parsing the JSON response.
        if (res.ok) {
          setUsers(data.users); // Updating state with the fetched users.
          if (data.users.length < 9) { // If fewer than 9 users are fetched, hide "Show More" button.
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message); // Logging any errors that occur during the fetch.
      }
    };
    if (currentUser.isAdmin) { // Only fetch users if the current user is an admin.
      fetchUsers();
    }
  }, [currentUser._id]); // Dependency array; effect runs when currentUser._id changes.

  // Function to load more users when "Show More" button is clicked.
  const handleShowMore = async () => {
    const startIndex = users.length; // Start fetching from the current length of users.
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`); // Fetching more users from the API.
      const data = await res.json(); // Parsing the JSON response.
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]); // Updating state with the newly fetched users.
        if (data.users.length < 9) { // If fewer than 9 new users are fetched, hide "Show More" button.
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message); // Logging any errors that occur during the fetch.
    }
  };

  // Function to handle user deletion.
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE', // Sending a DELETE request to the API.
      });
      const data = await res.json(); // Parsing the JSON response.
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete)); // Updating state to remove the deleted user.
        setShowModal(false); // Closing the modal.
      } else {
        console.log(data.message); // Logging error message if deletion fails.
      }
    } catch (error) {
      console.log(error.message); // Logging any errors that occur during the delete request.
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? ( // Conditional rendering based on admin status and user count.
        <>
          <Table hoverable className='shadow-md'> {/* Table to display user data with hover effect. */}
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => ( // Mapping through users to render each user's data in a row.
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()} {/* Displaying the date user was created.*/}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture} // Displaying the user's profile image.
                      alt={user.username} // Alt text for the image.
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full' // Image styling.
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell> {/* Displaying the username. */}
                  <Table.Cell>{user.email}</Table.Cell> {/* Displaying the user's email. */}
                  <Table.Cell>
                    {user.isAdmin ? ( // Conditional rendering based on admin status.
                      <FaCheck className='text-green-500' /> // Display check icon if user is admin.
                    ) : (
                      <FaTimes className='text-red-500' /> // Display times icon if user is not admin.
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => { // Setting up click handler for delete action.
                        setShowModal(true); // Show the confirmation modal.
                        setUserIdToDelete(user._id); // Set the user ID to be deleted.
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer' // Styling for the delete action.
                    >
                      Delete 
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && ( // Conditional rendering for "Show More" button.
            <button
              onClick={handleShowMore} // Click handler for loading more users.
              className='w-full text-teal-500 self-center text-sm py-7' // Styling for the button.
            >
              Show more // Button text.
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p> // Message displayed if no users are present.
      )}
      <Modal
        show={showModal} // Modal visibility state.
        onClose={() => setShowModal(false)} // Handler to close the modal.
        popup
        size='md' // Modal size.
      >
        <Modal.Header /> {/* Modal header without title. */}
        <Modal.Body>
          <div className='text-center'> {/* Centered content within the modal. */}
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' /> {/* Warning icon. */}
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'> {/* Confirmation message for deletion.*/}
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'> {/* Flexbox for action buttons. */}
              <Button color='failure' onClick={handleDeleteUser}> {/* Button for confirming deletion.*/}
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}> {/* Button for canceling deletion.*/}
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
