import React from 'react';
import './Home.css';
import zomatoBg from '../assets/zomato.jpg'; // ✅ Import image properly

const Home = () => {
  return (
    <div 
      className="home-container"
      style={{ backgroundImage: `url(${zomatoBg})` }}
    >
      <div className="overlay">
        <h1 className="home-title">Discover the Best Food & Drinks Near You</h1>
        <input type="text" className="search-bar" placeholder="Search for restaurants, cuisines..." />
      </div>
    </div>
  );
};

export default Home;
