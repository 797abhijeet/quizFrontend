import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const HomeMid = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/LsTXqTNZ/1.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
        <div id="home-cap" className="animated fadeIn flex flex-col items-center justify-center space-y-6">
          <h1 className="animated bounceInRight text-6xl font-extrabold uppercase tracking-wide leading-tight" style={{ animationDelay: '1s' }}>Quest</h1>
          <p className="animated bounceInLeft text-lg md:text-2xl md:w-2/3 leading-relaxed" style={{ animationDelay: '2s' }}>
            Create your <strong>Own</strong> Quiz and <strong>Random</strong> Quiz
          </p>
          <Link to="/register" className="animated bounceInRight bg-orange-500 hover:bg-orange-600 px-6 py-3 md:px-10 md:py-4 rounded-full text-lg font-semibold uppercase transition duration-300 shadow-lg" style={{ animationDelay: '3s' }}>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeMid;
