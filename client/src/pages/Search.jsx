// Import necessary components and libraries
import { Button, Select, TextInput } from 'flowbite-react'; // Import UI components from Flowbite
import { useEffect, useState } from 'react'; // Import hooks for state management and side effects
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks for routing
import PostCard from '../components/PostCard'; // Import PostCard component for rendering individual posts

// Define the Search component as a default export
export default function Search() {
  // State variables for managing search parameters and posts
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc', // Default sorting order is descending
    category: 'uncategorized', // Default category
  });

  console.log(sidebarData); // Log sidebarData for debugging
  const [posts, setPosts] = useState([]); // State to hold fetched posts
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [showMore, setShowMore] = useState(false); // State to manage showing more posts

  const location = useLocation(); // Hook to get the current location (URL)

  const navigate = useNavigate(); // Hook to enable programmatic navigation

  // useEffect hook to run side effects on component mount and when location.search changes
  useEffect(() => {
    // Get search parameters from the URL
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    // Update sidebarData if any search parameters are found in the URL
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      });
    }

    // Function to fetch posts based on search parameters
    const fetchPosts = async () => {
      setLoading(true); // Set loading state to true
      const searchQuery = urlParams.toString(); // Convert URL parameters to a query string
      const res = await fetch(`/api/post/getposts?${searchQuery}`); // Fetch posts from the API

      // Check if the response is okay
      if (!res.ok) {
        setLoading(false); // Set loading state to false
        return; // Exit the function if the response is not okay
      }

      // If the response is okay, process the data
      const data = await res.json();
      setPosts(data.posts); // Set the fetched posts to the state
      setLoading(false); // Set loading state to false

      // Check if there are more posts to show
      if (data.posts.length === 9) {
        setShowMore(true); // Show "Show More" button if there are 9 posts
      } else {
        setShowMore(false); // Hide button otherwise
      }
    };

    fetchPosts(); // Call the fetchPosts function
  }, [location.search]); // Run effect when the search parameters change

  // Function to handle input changes in the filters
  const handleChange = (e) => {
    // Update sidebarData based on which input field changed
    if (e.target.id === 'searchTerm') { 
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'; // Default to 'desc' if value is not provided
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized'; // Default to 'uncategorized' if value is not provided
      setSidebarData({ ...sidebarData, category });
    }
  };

  // Function to handle form submission for applying filters
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const urlParams = new URLSearchParams(location.search); // Create a URLSearchParams object

    // Set the search parameters in the URL
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    
    const searchQuery = urlParams.toString(); // Convert URL parameters to a query string
    navigate(`/search?${searchQuery}`); // Navigate to the search results with updated parameters
  };

  // Function to load more posts when "Show More" is clicked
  const handleShowMore = async () => {
    const numberOfPosts = posts.length; // Get the current number of posts
    const startIndex = numberOfPosts; // Determine the start index for fetching more posts
    const urlParams = new URLSearchParams(location.search); // Create a URLSearchParams object

    // Set the startIndex parameter in the URL
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString(); // Convert to query string
    const res = await fetch(`/api/post/getposts?${searchQuery}`); // Fetch more posts from the API

    // Check if the response is okay
    if (!res.ok) {
      return; // Exit if the response is not okay
    }

    // If the response is okay, process the data
    const data = await res.json();
    setPosts([...posts, ...data.posts]); // Append new posts to the existing posts

    // Check if there are more posts to show
    if (data.posts.length === 9) {
      setShowMore(true); // Show "Show More" button if there are 9 posts
    } else {
      setShowMore(false); // Hide button otherwise
    }
  };

  // Render the component
  return (
    <div className='flex flex-col md:flex-row'> {/* Flex container for layout */}
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'> {/* Sidebar for filters */}
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}> {/* Form element */}
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm' // Input id for search term
              type='text'
              value={sidebarData.searchTerm} // Controlled input with value from state
              onChange={handleChange} // Handle input changes
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'> {/* Dropdown for sorting options */}
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'> {/* Dropdown for category selection */}
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'> {/* Submit button for applying filters */}
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'> {/* Main content area for displaying posts */}
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results: {/* Heading for posts results */}
        </h1>
        <div className='p-7 flex flex-wrap gap-4'> {/* Container for posts */}
          {!loading && posts.length === 0 && ( // Show message if no posts found
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>} {/* Show loading message if loading */}
          {!loading && // Map over posts and render PostCard for each
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && ( // Show "Show More" button if applicable
            <button
              onClick={handleShowMore} // Load more posts on click
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
