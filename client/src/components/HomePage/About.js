import React from "react";
import AboutBackground from "./about-background.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-text-container">
        {/* <p className="primary-subheading">About</p> */}
        <h1 className="primary-heading1">
        Engage your mind with our bite-sized quiz challenges🚀 </h1>
        <p className="primary-text">
        Welcome to our dynamic quiz website, where knowledge meets excitement! Immerse yourself in a diverse range of quizzes, from general knowledge to specialized topics.
        
        </p>
        <p className="primary-text">
        Unleash your curiosity and embark on a thrilling journey of learning – start quizzing today!
        </p>
        <div className="about-buttons-container">
      
        </div>
      </div>
    </div>
  );
};

export default About;