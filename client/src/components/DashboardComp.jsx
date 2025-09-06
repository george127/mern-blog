import { useEffect, useState } from 'react'; // Importing hooks from React for state management and side effects
import { useSelector } from 'react-redux'; // Importing useSelector hook to access Redux store state
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi'; // Importing icons for better UI representation
import { Button, Table } from 'flowbite-react'; // Importing components from Flowbite for UI design
import { Link } from 'react-router-dom'; // Importing Link component for navigation between routes

// DashboardComp is a functional component that represents the dashboard interface
export default function DashboardComp() {
  // Setting up state variables to store user, comment, and post data
  const [users, setUsers] = useState([]); // State for storing user data
  const [comments, setComments] = useState([]); // State for storing comment data
  const [posts, setPosts] = useState([]); // State for storing post data
  const [totalUsers, setTotalUsers] = useState(0); // State for total users count
  const [totalPosts, setTotalPosts] = useState(0); // State for total posts count
  const [totalComments, setTotalComments] = useState(0); // State for total comments count
  const [lastMonthUsers, setLastMonthUsers] = useState(0); // State for last month's new users count
  const [lastMonthPosts, setLastMonthPosts] = useState(0); // State for last month's new posts count
  const [lastMonthComments, setLastMonthComments] = useState(0); // State for last month's new comments count
  const { currentUser } = useSelector((state) => state.user); // Accessing currentUser from the Redux store

  // useEffect hook to fetch data when the component mounts or when currentUser changes
  useEffect(() => {
    // Function to fetch user data
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5'); // Fetching users from the API
        const data = await res.json(); // Parsing the JSON response
        if (res.ok) {
          // If the response is successful
          setUsers(data.users); // Setting the users state
          setTotalUsers(data.totalUsers); // Setting total users count
          setLastMonthUsers(data.lastMonthUsers); // Setting last month's new users count
        }
      } catch (error) {
        console.log(error.message); // Logging any error that occurs during fetch
      }
    };

    // Function to fetch post data
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5'); // Fetching posts from the API
        const data = await res.json(); // Parsing the JSON response
        if (res.ok) {
          // If the response is successful
          setPosts(data.posts); // Setting the posts state
          setTotalPosts(data.totalPosts); // Setting total posts count
          setLastMonthPosts(data.lastMonthPosts); // Setting last month's new posts count
        }
      } catch (error) {
        console.log(error.message); // Logging any error that occurs during fetch
      }
    };

    // Function to fetch comment data
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5'); // Fetching comments from the API
        const data = await res.json(); // Parsing the JSON response
        if (res.ok) {
          // If the response is successful
          setComments(data.comments); // Setting the comments state
          setTotalComments(data.totalComments); // Setting total comments count
          setLastMonthComments(data.lastMonthComments); // Setting last month's new comments count
        }
      } catch (error) {
        console.log(error.message); // Logging any error that occurs during fetch
      }
    };

    // Fetch data only if the current user is an admin
    if (currentUser.isAdmin) {
      fetchUsers(); // Calling fetchUsers function
      fetchPosts(); // Calling fetchPosts function
      fetchComments(); // Calling fetchComments function
    }
  }, [currentUser]); // Dependencies array to re-run the effect when currentUser changes

  return (
    // Main container for the dashboard section
    <div className='p-3 md:mx-auto'>
      {/* Flex container to hold summary cards */}
      <div className='flex-wrap flex gap-4 justify-center'>
        
        {/* Card for Total Users */}
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              {/* Title and Total Users Count */}
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            {/* Icon representing user group */}
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            {/* Increase in user count for last month */}
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp /> {/* Icon for upward trend */}
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        
        {/* Card for Total Comments */}
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              {/* Title and Total Comments Count */}
              <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            {/* Icon representing comments */}
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            {/* Increase in comment count for last month */}
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp /> {/* Icon for upward trend */}
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        
        {/* Card for Total Posts */}
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              {/* Title and Total Posts Count */}
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            {/* Icon representing posts */}
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            {/* Increase in post count for last month */}
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp /> {/* Icon for upward trend */}
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      
      {/* Flex container for Recent Users, Comments, and Posts */}
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        
        {/* Section for Recent Users */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              {/* Button to see all users */}
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              {/* Table headers for user image and username */}
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && // Check if users exist
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {/* Display user profile image */}
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
  
        {/* Section for Recent Comments */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent comments</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              {/* Button to see all comments */}
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              {/* Table headers for comment content and likes */}
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && // Check if comments exist
              comments.map((comment) => (
                <Table.Body key={comment._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-96'>
                      {/* Display comment content with a line clamp for overflow */}
                      <p className='line-clamp-2'>{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
  
        {/* Section for Recent Posts */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent posts</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              {/* Button to see all posts */}
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              {/* Table headers for post image, title, and category */}
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts && // Check if posts exist
              posts.map((post) => (
                <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {/* Display post image */}
                      <img
                        src={post.image}
                        alt='post'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{post.title}</Table.Cell>
                    <Table.Cell className='w-5'>{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
  
}