import React from 'react';
import { FiPhoneCall, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
const SponsorConnectCard = () => {
  return (
    <div className="flex flex-col md:flex-row w-full bg-black min-h-screen overflow-hidden">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-start px-6 py-16 sm:px-10 md:px-12 lg:px-20 bg-gray-200 text-black relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-pink-100 opacity-30 blur-xl"></div>
        <div className="absolute bottom-20 -right-10 w-40 h-40 rounded-full bg-pink-100 opacity-20 blur-xl"></div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 relative">
          <span className="relative inline-block">
            <span className="bg-pink-400 px-2 transform -skew-x-6 inline-block">CURATED</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-pink-400 transform -skew-x-6"></span>
          </span>
          <br />
          <span className="text-gray-800">SERVICES -</span><br />
          <span className="text-gray-800">TARGETED</span><br />
          <span className="text-gray-800">SPONSORS</span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
          Power your event with Dreamventz — a platform where organizers find verified vendors, creative support, and matching sponsors for their audience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/sponserconnect" className="bg-pink-400 hover:bg-pink-500 text-black font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg">
            <FiPhoneCall className="text-lg" />
            <span>Connect with Sponsers</span>
            <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <button className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-all">
            <span>LEARN MORE</span>
          </button>
        </div>
        
        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((item) => (
              <img 
                key={item}
                src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item}0.jpg`}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p>Join <span className="font-semibold">500+</span> event organizers</p>
            <p className="text-xs text-pink-600">★ ★ ★ ★ ★ (4.9/5.0)</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 grid grid-cols-3 gap-0 h-[300px] sm:h-[400px]  md:h-screen relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20 z-0"></div>
        
        {/* Images with hover effects */}
        {[
          "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        ].map((src, index) => (
          <div 
            key={index}
            className="relative overflow-hidden group"
          >
            <img
              src={src}
              alt={`Event Visual ${index + 1}`}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
        ))}
        
        {/* Tag overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-pink-400 text-black font-bold px-6 py-3 text-sm sm:text-base rounded-full shadow-xl flex items-center gap-2 animate-pulse">
            <span>#FIND YOUR PERFECT SPONSOR</span>
            <FiArrowRight className="animate-bounce" />
          </div>
        </div>
        
        {/* Branding */}
        <div className="absolute bottom-4 right-4 text-white text-xs sm:text-sm p-2 bg-black bg-opacity-50 rounded-full backdrop-blur-sm">
          @dreamventz.in
        </div>
      </div>
    </div>
  );
};

export default SponsorConnectCard;