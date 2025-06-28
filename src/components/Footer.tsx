import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-white/30 text-sm text-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Where is My BIT Bus</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Real-time tracking for BIT Patna buses – built with love by
            <a
              href="https://www.linkedin.com/in/adityaagarwal2003/"
              className="text-blue-600 hover:underline ml-1"
              target="_blank" rel="noopener noreferrer"
            >Aditya</a>.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
            <li><a href="/student" className="hover:text-blue-600 transition-colors">Student Dashboard</a></li>
            <li><a href="/driver" className="hover:text-blue-600 transition-colors">Driver Dashboard</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-2">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://bitvalut.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >Need Resources?</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-2">Contact</h4>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:aditya@example.com" className="hover:text-blue-600">aditya@example.com</a></li>
            <li>
              <a href="https://github.com/adiagarwal2003" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center py-4 bg-white/60 text-gray-500 border-t border-white/20 text-xs">
        &copy; {new Date().getFullYear()} BIT Patna. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;