import React, { useState } from 'react';
import competitionStar from './competition-star.svg';
import Login from './Login';
import Signup from './Signup';

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignup(false);
  };

  const openSignup = () => {
    setIsLoginOpen(true);
    setIsSignup(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'login-overlay') {
      closeLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#078dfb] via-black to-[#101724] text-white relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="w-full fixed top-0 left-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur-lg z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 bg-clip-text text-transparent">Telecalli</div>
          <div className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-lg font-medium transition relative text-transparent text-white"
            >
              Home
              <span className="block w-full h-1 mt-1 bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 rounded"></span>
            </a>
            <a href="/" className="text-white text-lg font-medium hover:text-blue-400 transition">Contact Us</a>
          </div>
          <button
            onClick={openLogin}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 text-center mt-10 flex flex-col items-center justify-center">
        {/* Rotating Star Image */}
        <img
          src={competitionStar}
          alt="Competition Star"
          className="w-36 h-36 mb-4 animate-spin-slow"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 bg-clip-text text-transparent">
          Telecalli
        </h1>
        <br /><br />
        <p className="text-lg md:text-xl mb-6">
          Empower Your Sales with AI-Driven Calls
        </p>
        <p className="text-lg md:text-xl mb-6 max-w-4xl mx-auto text-center" style={{ color: '#9E9E9E' }}>
          With Telecalli, you can effortlessly handle cold calls, delivering personalized product pitches to potential customers. It’s more than just a calling tool, Telecalli listens, responds intelligently, and even answers customer queries using advanced AI, helping you scale your sales efforts without the hassle.
        </p>
        <button
          onClick={openLogin}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
        >
          Get Started
        </button>
      </div>

      {/* Login/Signup Dialog Box */}
      {isLoginOpen && (
        <div
          id="login-overlay"
          className="absolute z-20 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              onClick={closeLogin}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            {isSignup ? (
              <Signup closeLogin={closeLogin} openLogin={openLogin} />
            ) : (
              <Login closeLogin={closeLogin} openSignup={openSignup} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
