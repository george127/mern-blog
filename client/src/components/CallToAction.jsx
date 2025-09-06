import { Button } from 'flowbite-react'; // Importing Button component from Flowbite for styling.

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      {/* Container for the call-to-action section with responsive flex layout and styling */}
      
      <div className="flex-1 justify-center flex flex-col">
        {/* Flex container for the text content, set to take available space */}
        
        <h2 className='text-2xl'>
          Want to learn more about JavaScript?
        </h2>
        {/* Main headline encouraging users to learn more */}
        
        <p className='text-gray-500 my-2'>
          Checkout these resources with 100 JavaScript Projects
        </p>
        {/* Description of what the user can expect from the resources */}
        
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
          {/* Button with a gradient style, rounded corners */}
          <a href="https://www.100jsprojects.com" target='_blank' rel='noopener noreferrer'>
            {/* Link to the resource, opens in a new tab with security attributes */}
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      
      <div className="p-7 flex-1">
        {/* Flex container for the image, set to take available space */}
        <img 
          src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" 
          alt="JavaScript Projects" // Added alt attribute for accessibility
        />
      </div>
    </div>
  );
}
