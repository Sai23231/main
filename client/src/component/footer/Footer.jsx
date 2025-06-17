import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      {/* Top Section */}
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Explore Section */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/wedplan" className="hover:text-gray-400">
                WedPlan
              </Link>
            </li>
            <li>
              <Link to="/packages" className="hover:text-gray-400">
                Packages
              </Link>
            </li>
            <li>
              <Link to="/testimonials" className="hover:text-gray-400">
                Testimonials
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-gray-400">
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Wedding Vendors Section */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Wedding Vendors</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/makeup" className="hover:text-gray-400">
                Bridal Makeup
              </Link>
            </li>
            <li>
              <Link to="/photographer" className="hover:text-gray-400">
                Photographers
              </Link>
            </li>
            <li>
              <Link to="/mehndi" className="hover:text-gray-400">
                Mehendi Artists
              </Link>
            </li>
            <li>
              <Link to="/caterers" className="hover:text-gray-400">
                Caterers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Wedding Vendors</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/makeup" className="hover:text-gray-400">
                Venues
              </Link>
            </li>
            <li>
              <Link to="/decorator" className="hover:text-gray-400">
                Decorators
              </Link>
            </li>
            <li>
              <Link to="/dj" className="hover:text-gray-400">
                DJ/Band
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}

        {/* Contact Info Section */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
          <p className="mb-2">Phone: +91 9321505018 </p>
          <p className="mb-2">Email: www.dream.wedzz@gmail.com</p>
          <p>Address: Mumbai, India</p>
          <div className="mt-4 flex space-x-4">
            {/* Social Media Icons */}
            <Link to="" className="hover:text-gray-400">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="" className="hover:text-gray-400">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link to="" className="hover:text-gray-400">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="" className="hover:text-gray-400">
              <i className="fab fa-linkedin-in"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter & Support Section */}
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10 py-10 mt-10 border-t border-gray-800">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Help & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="" className="hover:text-gray-400">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                to="/support"
                className="hover:text-gray-400"
              >
                Customer Support
              </Link>
            </li>
            <li>
              <Link to="" className="hover:text-gray-400">
                Cancellation Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-800 py-4 mt-10">
        <p className="text-center text-gray-400 text-sm">
          © 2024 Dreamwedz. All rights reserved. | Privacy Policy | Terms &
          Conditions
        </p>
      </div>
    </footer>
  );
}

export default Footer;
