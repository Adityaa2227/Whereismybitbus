import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 text-sm text-gray-700 border-t bg-white/80 backdrop-blur-lg border-white/30">
      <div className="grid grid-cols-1 gap-8 px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Where is My BIT Bus</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Real-time tracking for BIT Patna buses – built with love by
            <a
              href="https://www.linkedin.com/in/aditya2227/"
              className="ml-1 text-blue-600 hover:underline"
              target="_blank" rel="noopener noreferrer"
            >Aditya</a>.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="transition-colors hover:text-blue-600">Home</a></li>
            <li><a href="/student" className="transition-colors hover:text-blue-600">Student Dashboard</a></li>
            <li><a href="/driver" className="transition-colors hover:text-blue-600">Driver Dashboard</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://bitp-vault.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-600"
              >Need Resources?</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Contact</h4>
          <ul className="space-y-2">
            <li> <a href="mailto:whereismybitbus@gmail.com" className="hover:text-blue-600">whereismybitbus@gmail.com</a></li>
            <li>
              <a href="https://www.linkedin.com/in/aditya2227/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-xs text-center text-gray-500 border-t bg-white/60 border-white/20">
        &copy; {new Date().getFullYear()} <a href="https://adityaagarwalportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Aditya Agarwal</a>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;