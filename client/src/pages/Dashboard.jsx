// Import necessary hooks and components
import { useEffect, useState } from 'react'; // useEffect for side effects and useState for state management
import { useLocation } from 'react-router-dom'; // useLocation to access the current URL and query parameters

// Import custom components for different sections of the dashboard
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

// Main Dashboard component
export default function Dashboard() {
  // Get the current URL location
  const location = useLocation();
  
  // Local state to track the current tab
  const [tab, setTab] = useState('');

  // Effect to set the tab based on URL query parameters
  useEffect(() => {
    // Use URLSearchParams to get the 'tab' parameter from the URL query string
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    
    // If 'tab' is present in the URL, set it as the current tab
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]); // Dependency on location.search means it runs whenever the URL changes

  return (
    // Flexbox layout for dashboard: Sidebar on the left, content on the right
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Sidebar component taking 56 width units on medium screens and up */}
      <div className='md:w-56'>
        {/* Sidebar section */}
        <DashSidebar />
      </div>
      
      {/* Conditionally render each section based on the selected tab */}
      
      {/* Profile tab */}
      {tab === 'profile' && <DashProfile />}
      
      {/* Posts management tab */}
      {tab === 'posts' && <DashPosts />}
      
      {/* Users management tab */}
      {tab === 'users' && <DashUsers />}
      
      {/* Comments management tab */}
      {tab === 'comments' && <DashComments />}
      
      {/* Main Dashboard overview */}
      {tab === 'dash' && <DashboardComp />}
    </div>
  );
}
