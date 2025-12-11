import React from 'react';
import { useNavigate } from 'react-router-dom';
import BannerBackground from "./home-banner-background.png";
import Header from "../Header";
import "./submitted.css";

const Submitted = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>
      <div className="submitted-container">
        <div className="submitted-heading">Submission Complete</div>
        <div className="submitted-content">
          <button className="submitted-button" onClick={() => navigate('/user')}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submitted;
