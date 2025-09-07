// Import necessary components and hooks
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main className="flex flex-col max-w-6xl min-h-screen p-3 mx-auto text-slate-900">
      {/* Post Title */}
      <h1 className="max-w-2xl p-3 mx-auto mt-10 font-serif text-3xl text-center text-purple-500 lg:text-4xl">
        {post && post.title}
      </h1>

      {/* Post Category */}
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button
          pill
          size="xs"
          className="transition-all border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
        >
          {post && post.category}
        </Button>
      </Link>

      {/* Post Image */}
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-xl shadow-lg border border-slate-300"
      />

      {/* Post Metadata */}
      <div className="flex justify-between w-full max-w-2xl p-3 mx-auto text-xs text-gray-600 border-b border-slate-800">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post Content */}
      <div
        className="w-full max-w-2xl p-3 mx-auto leading-relaxed text-gray-500 post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* Comment Section */}
      <CommentSection postId={post._id} />

      {/* Recent Posts */}
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="mt-5 text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Recent Articles
        </h1>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>

  );
}
