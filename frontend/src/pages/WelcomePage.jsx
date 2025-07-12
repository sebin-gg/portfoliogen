import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";


const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="glow-frame">
      <h1 className="site-title">CraftFolio</h1>
      <h2 className="tagline">Build your portfolio website in minutes!</h2>
      <p className="subtitle">Turn your skills into a sleek, professional portfolio</p>
      <button className="start-btn" onClick={() => navigate("/form")}>
        Start Building
      </button>
      </div>
    </div>

  );
};

export default WelcomePage;
