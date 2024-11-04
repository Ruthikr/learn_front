import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Footer Logo and Tagline */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-white">Ruthik</h2>
          <p className="text-gray-400 text-sm mt-1">Crafting Digital Experiences</p>
        </div>
        
        {/* Footer Links */}
        <div className="flex space-x-8 text-sm font-medium mb-6 md:mb-0">
          <a href="#about" className="hover:text-gray-500 transition-colors duration-200">About</a>
          <a href="#services" className="hover:text-gray-500 transition-colors duration-200">Services</a>
          <a href="#portfolio" className="hover:text-gray-500 transition-colors duration-200">Portfolio</a>
          <a href="#contact" className="hover:text-gray-500 transition-colors duration-200">Contact</a>
        </div>
        
        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition duration-200">
            <i className="fab fa-facebook-f text-blue-500"></i>
          </a>
          <a href="https://twitter.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition duration-200">
            <i className="fab fa-twitter text-blue-400"></i>
          </a>
          <a href="https://linkedin.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition duration-200">
            <i className="fab fa-linkedin-in text-blue-600"></i>
          </a>
          <a href="https://github.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition duration-200">
            <i className="fab fa-github text-gray-400"></i>
          </a>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Ruthik. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;