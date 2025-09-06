// Import the CallToAction component to be used in this component
import CallToAction from '../components/CallToAction';

// Define the Projects component as a default export
export default function Projects() {
  return (
    // Main container for the Projects page
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      {/* Heading for the Projects page */}
      <h1 className='text-3xl font-semibold'>Projects</h1>
      {/* Description of the page */}
      <p className='text-md text-gray-500'>Build fun and engaging projects while learning HTML, CSS, and JavaScript!</p>
      {/* CallToAction component that could provide further engagement (like links to projects or resources) */}
      <CallToAction />
    </div>
  );
}
