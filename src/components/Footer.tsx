import React from 'react';

const Footer: React.FC = () => {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 98f6374 (inital commit)
              target="_blank" rel="noopener noreferrer"
            >Aditya</a>.
          </p>
        </div>

        {/* Quick Links */}
        <div>
<<<<<<< HEAD
          <h4 className="text-md font-semibold text-gray-900 mb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
            <li><a href="/student" className="hover:text-blue-600 transition-colors">Student Dashboard</a></li>
            <li><a href="/driver" className="hover:text-blue-600 transition-colors">Driver Dashboard</a></li>
=======
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="transition-colors hover:text-blue-600">Home</a></li>
            <li><a href="/student" className="transition-colors hover:text-blue-600">Student Dashboard</a></li>
            <li><a href="/driver" className="transition-colors hover:text-blue-600">Driver Dashboard</a></li>
>>>>>>> 98f6374 (inital commit)
          </ul>
        </div>

        {/* Resources */}
        <div>
<<<<<<< HEAD
          <h4 className="text-md font-semibold text-gray-900 mb-2">Resources</h4>
=======
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Resources</h4>
>>>>>>> 98f6374 (inital commit)
          <ul className="space-y-2">
            <li>
              <a
                href="https://bitvalut.com"
                target="_blank"
                rel="noopener noreferrer"
<<<<<<< HEAD
                className="hover:text-blue-600 transition-colors"
=======
                className="transition-colors hover:text-blue-600"
>>>>>>> 98f6374 (inital commit)
              >Need Resources?</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
<<<<<<< HEAD
          <h4 className="text-md font-semibold text-gray-900 mb-2">Contact</h4>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:aditya@example.com" className="hover:text-blue-600">aditya@example.com</a></li>
            <li>
              <a href="https://github.com/adiagarwal2003" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">GitHub</a>
=======
          <h4 className="mb-2 font-semibold text-gray-900 text-md">Contact</h4>
          <ul className="space-y-2">
            <li> <a href="mailto:whereismybitbus@gmail.com" className="hover:text-blue-600">whereismybitbus@gmail.com</a></li>
            <li>
              <a href="https://www.linkedin.com/in/aditya2227/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">LinkedIn</a>
>>>>>>> 98f6374 (inital commit)
            </li>
          </ul>
        </div>
      </div>
<<<<<<< HEAD
      <div className="text-center py-4 bg-white/60 text-gray-500 border-t border-white/20 text-xs">
        &copy; {new Date().getFullYear()} BIT Patna. All rights reserved.
=======
      <div className="py-4 text-xs text-center text-gray-500 border-t bg-white/60 border-white/20">
        &copy; {new Date().getFullYear()} <a href="https://adityaagarwalportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Aditya Agarwal</a>. All rights reserved.
>>>>>>> 98f6374 (inital commit)
      </div>
    </footer>
  );
};

export default Footer;