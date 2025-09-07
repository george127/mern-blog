import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen text-black bg-gradient-to-br">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center md:py-32 ">
        <div className="absolute inset-0 overflow-hidden ">
          <div className="absolute top-0 right-0 bg-purple-500 rounded-full w-96 h-96 filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 delay-1000 rounded-full w-96 h-96 bg-cyan-400 filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto ">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Geo's Blog</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-purple-400 md:text-xl">
            Explore articles and tutorials on web development, software engineering, and programming languages.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to='/search'
              className="px-6 py-3 font-medium text-purple-100 transition-all rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              View All Posts
            </Link>
            <Link
              to='/about'
              className="px-6 py-3 font-medium text-purple-700 transition-all border border-purple-500 rounded-lg hover:bg-purple-500/10"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Image & Features Section */}
      <section className="max-w-6xl px-4 py-16 mx-auto text-purple-400 from-slate-900">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="lg:w-1/2">
            <div className="relative group">
              <div className="relative overflow-hidden shadow-xl bg-slate-800 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Coding workspace"
                  className="object-cover w-full h-64 md:h-80"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-cyan-300">My Coding Journey</h3>
                  <p className="text-purple-100">Sharing my experiences and knowledge gained through years of development.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="mb-8 text-3xl font-bold text-center lg:text-left">
              What You'll <span className="text-cyan-300">Discover</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold">Web Development</h3>
                  <p className="text-gray-400">Latest frameworks, techniques, and best practices for modern web development.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold">Software Engineering</h3>
                  <p className="text-gray-400">Principles and patterns for building scalable, maintainable software systems.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold">Programming Languages</h3>
                  <p className="text-gray-400">Deep dives into language features, ecosystems, and practical applications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Recent Posts Section */}
      <section className="max-w-6xl px-4 py-16 mx-auto">
        <div className="mb-12 text-center">
          {/* Gradient header */}
          <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            Recent Posts
          </h2>

          {/* Gray description text */}
          <p className="max-w-2xl mx-auto text-gray-400">
            Explore the latest content from the blog. New articles published weekly.
          </p>
        </div>

        {posts && posts.length > 0 && (
          <div className="space-y-0">
            {/* Posts Grid */}
            <div className="flex flex-wrap justify-center gap-6">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post._id}

                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            <br />
            {/* View All Button */}
            <div className="text-center">
              <Link
                to={'/search'}
                className="px-6 py-3 font-medium text-purple-100 transition-all rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                View All Posts
                
              </Link>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}