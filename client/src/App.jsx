// Import necessary modules and components for routing
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components from react-router-dom
import Home from './pages/Home'; // Import Home page component
import About from './pages/About'; // Import About page component
import SignIn from './pages/SignIn'; // Import Sign-In page component
import Dashboard from './pages/Dashboard'; // Import Dashboard page component 
import Projects from './pages/Projects'; // Import Projects page component
import SignUp from './pages/SignUp'; // Import Sign-Up page component
import Header from './components/Header'; // Import Header component
import Footer from './components/Footer'; // Import Footer component
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute for protecting routes
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'; // Import for admin-only protected routes
import CreatePost from './pages/CreatePost'; // Import Create Post page component
import UpdatePost from './pages/UpdatePost'; // Import Update Post page component
import PostPage from './pages/PostPage'; // Import Post Page component
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop component for smooth scrolling
import Search from './pages/Search'; // Import Search page component

// Main App component
export default function App() {
  return (
    // BrowserRouter wraps the entire application to enable routing
    <BrowserRouter>
      <ScrollToTop /> {/* Component to handle scroll to top on route change */}
      <Header /> {/* Render the Header component */}
      <Routes> {/* Define the routes for the application */}
        <Route path='/' element={<Home />} /> {/* Home route */}
        <Route path='/about' element={<About />} /> {/* About route */}
        <Route path='/sign-in' element={<SignIn />} /> {/* Sign-In route */}
        <Route path='/sign-up' element={<SignUp />} /> {/* Sign-Up route */}
        <Route path='/search' element={<Search />} /> {/* Search route */}
        
        {/* Private route for Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} /> {/* Dashboard route */}
        </Route>
        
        {/* Admin-only private routes for creating and updating posts */}
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} /> {/* Create Post route */}
          <Route path='/update-post/:postId' element={<UpdatePost />} /> {/* Update Post route with postId parameter */}
        </Route>

        <Route path='/projects' element={<Projects />} /> {/* Projects route */}
        <Route path='/post/:postSlug' element={<PostPage />} /> {/* Individual Post route with postSlug parameter */}
      </Routes>
      <Footer /> {/* Render the Footer component */}
    </BrowserRouter>
  );
}
