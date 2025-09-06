// Importing necessary components and libraries from Flowbite and React Router.
import { Footer } from 'flowbite-react'; // Importing the Footer component from Flowbite.
import { Link } from 'react-router-dom'; // Importing the Link component for routing.
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs'; // Importing social media icons from react-icons.

export default function FooterCom() { // Declaring the FooterCom functional component.
  return (
    <Footer container className='border border-t-8 border-teal-500'> {/* Creating a footer with a top border.*/}
      <div className='w-full max-w-7xl mx-auto'> {/* Container for content, centering it within a max width.*/}
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'> {/* Layout for the footer content, responsive grid for smaller screens.*/}
          <div className='mt-5'> {/* Div for the blog title.*/}
            <Link
              to='/' // Link to navigate to the home page.
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white' // Styling the link.
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'> 
                Sahand&apos;s
              </span>
              Blog {/* Blog title text.*/}
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'> {/* Grid layout for footer links.*/}
            <div> {/* Column for "About" links.*/}
              <Footer.Title title='About' /> {/* Footer title for the section.*/}
              <Footer.LinkGroup col> {/* Group for footer links.*/}
                <Footer.Link
                  href='https://www.100jsprojects.com' // Link to an external site.
                  target='_blank' // Opens the link in a new tab.
                  rel='noopener noreferrer' // Security feature for external links.
                >
                  100 JS Projects // Link text.
                </Footer.Link>
                <Footer.Link
                  href='/about' // Link to the about page.
                  target='_blank' // Opens the link in a new tab.
                  rel='noopener noreferrer' // Security feature for external links.
                >
                  Sahand&apos;s Blog {/* Link text.*/}
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div> {/* Column for "Follow us" links.*/}
              <Footer.Title title='Follow us' /> {/* Footer title for the section.*/}
              <Footer.LinkGroup col> {/* Group for footer links.*/}
                <Footer.Link
                  href='https://www.github.com/sahandghavidel' // Link to Github profile.
                  target='_blank' // Opens the link in a new tab.
                  rel='noopener noreferrer' // Security feature for external links.
                >
                  Github {/* Link text.*/}
                </Footer.Link>
                <Footer.Link href='#'>Discord</Footer.Link> {/* Link to Discord (URL placeholder).*/}
              </Footer.LinkGroup>
            </div>
            <div> {/* Column for "Legal" links.
              <Footer.Title title='Legal' /> {/* Footer title for the section.*/}
              <Footer.LinkGroup col>  {/* Group for footer links.*/}
                <Footer.Link href='#'>Privacy Policy</Footer.Link> {/* Link to Privacy Policy (URL placeholder).*/}
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link> {/* Link to Terms and Conditions (URL placeholder).*/}
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider /> {/* Divider between main footer content and copyright section.*/}
        <div className='w-full sm:flex sm:items-center sm:justify-between'> {/* Container for copyright and social icons, responsive layout.*/}
          <Footer.Copyright
            href='#' // Link for copyright (URL placeholder).
            by="Sahand's blog" // Copyright notice.
            year={new Date().getFullYear()} // Current year dynamically rendered.
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center"> {/* Flex container for social media icons.*/}
            <Footer.Icon href='#' icon={BsFacebook}/>{/* Link to Facebook (URL placeholder). */}
            <Footer.Icon href='#' icon={BsInstagram}/>{/* Link to Instagram (URL placeholder). */}
            <Footer.Icon href='#' icon={BsTwitter}/>{/* Link to Twitter (URL placeholder). */}
            <Footer.Icon href='https://github.com/sahandghavidel' icon={BsGithub}/>{/* Link to Github profile. */}
            <Footer.Icon href='#' icon={BsDribbble}/>{/* Link to Dribbble (URL placeholder). */}
          </div>
        </div>
      </div>
    </Footer>
  );
}
