import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import '../styles/ResultPage.css';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const [copied, setCopied] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const navigate = useNavigate();

  const portfolioURL = "https://yourportfolio.com";

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAnother = () => {
    navigate("/");
  };

  return (
    <div className="result-page">
      <Confetti width={dimensions.width} height={dimensions.height} />
      <div className="result-box">
        <h1 className="result-heading">Your Portfolio is Ready!</h1>
        <div className="url-box">{portfolioURL}</div>

        <button className="copy-btn" onClick={handleCopy}>Copy Link</button>
        {copied && <p className="copied-msg">Link copied ✅</p>}

        <button className="generate-btn" onClick={handleGenerateAnother}>
          Generate Another
        </button>
      </div>
    </div>
  );
};


export default ResultPage;
