import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-sm text-gray-500 py-4 mt-8">
      Created by{' '}
      <a 
        href="https://www.linkedin.com/in/adityaagarwal2003/" 
        className="text-blue-500 hover:underline transition-colors duration-200" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Aditya
      </a>
    </footer>
  );
};

export default Footer;