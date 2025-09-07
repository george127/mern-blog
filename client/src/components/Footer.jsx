import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsArrowUp } from 'react-icons/bs';

export default function FooterCom() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Footer container className="relative text-white border-0 rounded-none bg-gradient-to-br from-slate-700 via-purple-700 to-slate-700">
      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="absolute p-3 transition-all duration-300 transform -translate-x-1/2 rounded-full shadow-lg -top-5 left-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 hover:-translate-y-1"
        aria-label="Back to top"
      >
        <BsArrowUp className="w-5 h-5" />
      </button>
      
      <div className="w-full px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center mb-6 text-2xl font-bold"
            >
              <span className="px-3 py-2 text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Geo&apos;s
              </span>
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Blog
              </span>
            </Link>
            <p className="max-w-xs mb-6 text-sm text-purple-200">
              Exploring the world of web development, one project at a time. Join me on this coding journey!
            </p>
            
            {/* Newsletter subscription */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-cyan-300">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-3 py-2 text-sm border border-purple-500 rounded-l-lg bg-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                />
                <button className="px-3 py-2 text-sm font-medium transition-colors rounded-r-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          {/* Links sections */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <Footer.Title title="Explore" className="mb-4 text-base tracking-wider uppercase text-cyan-300" />
              <Footer.LinkGroup col className="space-y-3">
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  100 JS Projects
                </Footer.Link>
                <Footer.Link 
                  href="/about" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  Geo&apos;s Blog
                </Footer.Link>
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  Tutorials
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            
            <div>
              <Footer.Title title="Connect" className="mb-4 text-base tracking-wider uppercase text-cyan-300" />
              <Footer.LinkGroup col className="space-y-3">
                <Footer.Link 
                  href="https://github.com/george127" 
                  target="_blank"
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  GitHub
                </Footer.Link>
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  Discord
                </Footer.Link>
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            
            <div>
              <Footer.Title title="Legal" className="mb-4 text-base tracking-wider uppercase text-cyan-300" />
              <Footer.LinkGroup col className="space-y-3">
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  Privacy Policy
                </Footer.Link>
                <Footer.Link 
                  href="#" 
                  className="flex items-center text-purple-200 transition-colors duration-200 hover:text-cyan-300 group"
                >
                  <span className="w-1 h-1 mr-2 transition-transform rounded-full bg-cyan-400 group-hover:scale-125"></span>
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        
        <Footer.Divider className="my-8 border-purple-700" />
        
        <div className="flex flex-col items-center justify-between w-full md:flex-row">
          <Footer.Copyright
            href="#"
            by="Geo's Blog"
            year={new Date().getFullYear()}
            className="font-medium text-purple-300"
          />
          
          <div className="flex mt-4 space-x-4 md:mt-0">
            <Footer.Icon 
              href="#" 
              icon={BsFacebook}
              className="p-2 text-purple-300 transition-colors rounded-full hover:text-cyan-300 bg-slate-800 hover:bg-slate-700"
            />
            <Footer.Icon 
              href="#" 
              icon={BsInstagram}
              className="p-2 text-purple-300 transition-colors rounded-full hover:text-cyan-300 bg-slate-800 hover:bg-slate-700"
            />
            <Footer.Icon 
              href="#" 
              icon={BsTwitter}
              className="p-2 text-purple-300 transition-colors rounded-full hover:text-cyan-300 bg-slate-800 hover:bg-slate-700"
            />
            <Footer.Icon 
              href="https://github.com/george127" 
              icon={BsGithub}
              className="p-2 text-purple-300 transition-colors rounded-full hover:text-cyan-300 bg-slate-800 hover:bg-slate-700"
            />
            <Footer.Icon 
              href="#" 
              icon={BsDribbble}
              className="p-2 text-purple-300 transition-colors rounded-full hover:text-cyan-300 bg-slate-800 hover:bg-slate-700"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}