// Importing the Link component from react-router-dom for navigation purposes.
import { Link } from 'react-router-dom';

// Defining a functional component named PostCard that receives a post object as a prop.
export default function PostCard({ post }) {
  return (
    // Outer div that contains the entire post card with styles for borders, dimensions, and transitions.
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      {/* Link to navigate to the specific post when clicked. The URL includes the slug of the post. */}
      <Link to={`/post/${post.slug}`}>
        {/* Image of the post. It has styling for size and cover behavior. 
            It changes height on hover due to the group class. */}
        <img
          src={post.image} // Source of the image from the post object
          alt='post cover' // Alt text for accessibility
          className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      {/* Div to hold the title and category of the post, with padding and flex layout. */}
      <div className='p-3 flex flex-col gap-2'>
        {/* Title of the post with a maximum of two lines shown. */}
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        {/* Category of the post styled in italics and smaller text. */}
        <span className='italic text-sm'>{post.category}</span>
        {/* Link to read the article. Positioned absolutely to allow for hover effects. */}
        <Link
          to={`/post/${post.slug}`} // Link to navigate to the specific post
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          {/* Text for the link that indicates it will take the user to the article. */}
          Read article
        </Link>
      </div>
    </div>
  );
}
