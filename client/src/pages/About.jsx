export default function About() {
  return (
    // This div is the container for the whole page. 
    // 'min-h-screen' ensures that the div takes up at least the full screen height.
    // 'flex' is a utility that enables Flexbox, 'items-center' centers the content vertically, 
    // and 'justify-center' centers the content horizontally.
    <div className='flex items-center justify-center min-h-screen'> 

      {/* The content is wrapped in a div to limit its width to a maximum of 2xl (max-w-2xl) for better readability. 
      'mx-auto' centers it horizontally, 'p-3' adds padding around the content, and 'text-center' centers the text. */}
      <div className='max-w-2xl p-3 mx-auto text-center'>
        
        {/* Another div is used to contain the actual content. */}
        <div>

          {/* This is the main heading (h1) for the "About" page. 
          'text-3xl' sets the font size to 3xl (extra-large), 'font-semibold' makes the text bold, 
          'text-center' centers the heading, and 'my-7' adds top and bottom margin for spacing. */}
          <h1 className='text-3xl font-semibold text-center font my-7'>
            About Sahand&apos; Blog
          </h1>

          {/* This div wraps the paragraphs describing the blog. 
          'text-md' sets the font size to medium, and 'text-gray-500' changes the text color to gray for a subtle look.
          'flex flex-col' arranges the paragraphs in a vertical stack (column), and 'gap-6' adds space between the paragraphs. */}
          <div className='flex flex-col gap-6 text-gray-500 text-md'>
            
            {/* Paragraph explaining the blog's purpose and introducing Sahand as the author. 
            'Welcome to Sahand&apos;s Blog!' is the introductory line. */}
            <p>
              Welcome to Sahand&apos;s Blog! This blog was created by Sahand Ghavidel
              as a personal project to share his thoughts and ideas with the
              world. Sahand is a passionate developer who loves to write about
              technology, coding, and everything in between.
            </p>

            {/* Second paragraph giving an overview of the blog’s content. 
            It describes the topics covered on the blog, such as web development, software engineering, and programming languages. */}
            <p>
              On this blog, you&apos;ll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Sahand is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>

            {/* Third paragraph encouraging engagement and interaction in the blog’s comment section.
            It highlights the ability for users to leave comments, like others' comments, and engage in discussions. */}
            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people&apos;s comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
