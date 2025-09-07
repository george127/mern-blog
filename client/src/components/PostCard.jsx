// Importing the Link component from react-router-dom for navigation purposes.
import { Link } from 'react-router-dom';

// Defining a functional component named PostCard that receives a post object as a prop.
export default function PostCard({ post }) {
  return (
    // Outer container for the post card
    <div className="group relative w-full sm:w-[430px] overflow-hidden rounded-xl shadow-md border hover:shadow-purple-500/40 hover:h-[400px] transition-all">
      {/* Clickable image linking to the post */}
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>

      {/* Content section */}
      <div className="flex flex-col gap-2 p-3">
        {/* Post title */}
        <p className="text-lg font-semibold text-purple-500 group-hover:text-purple-600 line-clamp-2">
          {post.title}
        </p>

        {/* Category */}
        <span className="text-sm italic text-gray-400">{post.category}</span>

        {/* Read Article button */}
        <Link
          to={`/post/${post.slug}`}
          className="absolute bottom-[-200px] left-0 right-0 m-2  text-center  !rounded-tl-none
          border border-indigo-500
          hover:bg-indigo-600 hover:text-white transition-all duration-300
          z-10 group-hover:bottom-0 px-6 py-3 font-medium text-purple-100 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          Read Article
        </Link>

      </div>
    </div>
  );
}
