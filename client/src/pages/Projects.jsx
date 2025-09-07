// Import any needed icons
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <div className="flex flex-col items-center justify-center max-w-4xl min-h-screen gap-8 p-6 mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-purple-700">🚀 Projects</h1>

      {/* Description */}
      <p className="max-w-2xl text-center text-gray-400">
        Practice your skills by building real-world projects with{" "}
        <span className="font-semibold text-cyan-400">HTML, CSS, JavaScript</span> and 
        scale up to the{" "}
        <span className="font-semibold text-indigo-500">MERN Stack</span>.
        Learn by doing and make your portfolio stand out!
      </p>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Project 1 */}
        <div className="flex flex-col overflow-hidden transition border border-gray-300 shadow-lg rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Student Form Project"
            className="object-cover w-full h-48"
          />
          <div className="flex flex-col flex-1 gap-4 p-4">
            <h2 className="text-xl font-semibold text-purple-500">Student Form + Payments</h2>
            <p className="text-sm text-gray-400">
              A MERN stack project where students can fill forms and pay securely
              via <span className="text-cyan-400">Paystack</span>.
            </p>
            <Link
              to="https://github.com/george127/mern-blog"
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-500 transition border border-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white"
            >
              View on GitHub <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Project 2 */}
        <div className="flex flex-col overflow-hidden transition border border-gray-300 shadow-lg rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="Blog App"
            className="object-cover w-full h-48"
          />
          <div className="flex flex-col flex-1 gap-4 p-4">
            <h2 className="text-xl font-semibold text-purple-500">Blog App</h2>
            <p className="text-sm text-gray-400">
              A full-featured blog app where users can{" "}
              <span className="text-cyan-400">sign up, write posts, comment,</span> 
              and manage their profile.
            </p>
            <Link
              to="https://github.com/george127/mern-blog"
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-500 transition border border-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white"
            >
              View on GitHub <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div> 

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-lg text-slate-800 dark:text-slate-200">
          Ready to build your next project? 🎯
        </p>
        <a
          href="https://roadmap.sh/mern"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 font-medium text-white transition bg-purple-600 shadow-lg rounded-xl hover:bg-purple-700"
        >
          Explore MERN Roadmap
        </a>
      </div>
      <br />
    </div>
  );
}
