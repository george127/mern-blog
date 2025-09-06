// Import necessary components and hooks
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  // Extract the postSlug from the URL parameters
  const { postSlug } = useParams();

  // State variables
  const [loading, setLoading] = useState(true); // for managing loading state
  const [error, setError] = useState(false); // for managing error state
  const [post, setPost] = useState(null); // to hold the fetched post
  const [recentPosts, setRecentPosts] = useState(null); // to hold recent posts for suggestions

  // Effect to fetch the specific post based on the postSlug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); // Start the loading process
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`); // API call to get the post
        const data = await res.json();
        if (!res.ok) { // Handle API errors
          setError(true);
          setLoading(false);
          return;
        }
        // Set the post data if successful
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) { // Handle any network or runtime errors
        setError(true);
        setLoading(false);
      }
    };
    fetchPost(); // Call the function when postSlug changes
  }, [postSlug]);

  // Effect to fetch recent posts to display below the current post
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`); // Fetch limited number of recent posts
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts); // Set recent posts if successful
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // If still loading, show the spinner
  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Post Title */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>

      {/* Post Category as a link to filter by category */}
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>

      {/* Post Image */}
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />

      {/* Post metadata - created date and estimated reading time */}
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post content - rendered as HTML */}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* Call to Action component */}
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      {/* Comment section */}
      <CommentSection postId={post._id} />

      {/* Recent Posts */}
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
}
