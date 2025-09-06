// Import necessary dependencies and components
import { Link } from 'react-router-dom'; // Import Link to navigate between pages without reloading
import CallToAction from '../components/CallToAction'; // Import CallToAction component for user engagement
import { useEffect, useState } from 'react'; // useEffect for side-effects, useState to manage component state
import PostCard from '../components/PostCard'; // Import PostCard component to display individual posts

// Define the Home component as the default export
export default function Home() {
  // State to store the list of posts fetched from the server
  const [posts, setPosts] = useState([]);

  // useEffect to fetch posts when the component is mounted (runs on first render)
  useEffect(() => {
    // Async function to fetch posts data
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts'); // API call to fetch posts
      const data = await res.json(); // Parse the response JSON data
      setPosts(data.posts); // Update the posts state with the fetched data
    };
    fetchPosts(); // Call the function to fetch posts
  }, []); // Empty dependency array ensures this effect only runs once (on mount)

  return (
    <div>
      {/* Introduction Section */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        {/* Blog title */}
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        {/* Brief description of the blog */}
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you&apos;ll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        {/* Link to the search page to view all posts */}
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>

      {/* Call to Action section with a background */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      {/* Recent Posts Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {/* Check if posts exist and are loaded */}
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            {/* Section title */}
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            {/* Flexbox container to wrap post cards */}
            <div className='flex flex-wrap gap-4'>
              {/* Loop over posts array and render a PostCard for each post */}
              {posts.map((post) => (
                <PostCard key={post._id} post={post} /> // Use the unique post ID as the key
              ))}
            </div>
            {/* Link to the search page to view all posts */}
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
