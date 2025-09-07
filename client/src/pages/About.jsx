export default function About() {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Hero Section */}
      <section className="flex flex-col items-center max-w-5xl gap-10 p-6 mx-auto lg:flex-row lg:py-20">
        {/* Profile / Blog image */}
        <div className="flex justify-center lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            alt="About Geo's Blog"
            className="object-cover w-full max-w-md border shadow-2xl rounded-2xl border-slate-700"
          />
        </div>

        {/* Blog Info */}
        <div className="text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-6 text-4xl font-bold text-purple-400">
            About Geo&apos;s Blog
          </h1>
          <p className="mb-4 leading-relaxed text-gray-400">
            Welcome to <span className="font-semibold text-cyan-300">Geo&apos;s Blog</span> — 
            a space created by <span className="text-indigo-500">George Darko</span>, 
            a passionate developer and lifelong learner. Here, George shares his
            journey in coding, software engineering, and the ever-evolving tech
            world.
          </p>
          <p className="mb-4 leading-relaxed text-gray-400">
            This blog features weekly articles and tutorials covering{" "}
            <span className="font-medium text-purple-500">web development</span>,{" "}
            <span className="font-medium text-cyan-400">software engineering</span>, 
            and <span className="font-medium text-indigo-500">programming languages</span>. 
            Whether you’re a beginner or a seasoned dev, you’ll find valuable insights here.
          </p>
          <p className="leading-relaxed text-gray-400">
            More than just content, this blog is about{" "}
            <span className="font-semibold text-purple-400">community</span>.  
            Join the discussion in the comments, share your thoughts, and connect
            with like-minded learners worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="grid max-w-5xl gap-8 px-6 py-16 mx-auto md:grid-cols-3">
        <div className="p-6 transition-transform border shadow-lg rounded-xl hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1581092795360-fd1ca04f995b?auto=format&fit=crop&w=600&q=80"
            alt="Web Development"
            className="mb-4 rounded-lg"
          />
          <h3 className="mb-2 text-xl font-semibold text-cyan-300">Web Development</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Dive deep into HTML, CSS, JavaScript, React, and MERN stack tutorials designed
            for real-world projects.
          </p>
        </div>

        <div className="p-6 transition-transform border shadow-lg rounded-xl hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
            alt="Software Engineering"
            className="mb-4 rounded-lg"
          />
          <h3 className="mb-2 text-xl font-semibold text-purple-400">Software Engineering</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Learn principles, patterns, and strategies for building scalable and maintainable software systems.
          </p>
        </div>

        <div className="p-6 transition-transform border shadow-lg rounded-xl hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=600&q=80"
            alt="Programming Languages"
            className="mb-4 rounded-lg"
          />
          <h3 className="mb-2 text-xl font-semibold text-indigo-500">Programming Languages</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Explore the features and ecosystems of multiple languages with practical applications.
          </p>
        </div>
      </section>
    </div>
  );
}
