import React from 'react'

const Footer = () => {
  return (
<footer className="bg-gray-900 text-gray-300 py-6 mt-10">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
    {/* Left Section */}
    <p className="text-sm text-gray-400">
      &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Sports Analytics Hub</span>. All rights reserved.
    </p>

    {/* Right Section */}
    <div className="flex space-x-6 mt-4 md:mt-0">
      <a 
        href="/about" 
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        About
      </a>
      <a 
        href="/contact" 
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        Contact
      </a>
      <a 
        href="/privacy" 
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        Privacy Policy
      </a>
    </div>
  </div>
</footer>


  )
}

export default Footer

