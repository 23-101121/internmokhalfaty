import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Preloader.css';

// Import your custom image assets
import microbusImg from '../assets/microbus_preloader.png';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // 1. Progress Bar Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true); // Signal loading is complete
          return 100;
        }
        // Randomly increment progress to look natural
        const increment = Math.floor(Math.random() * 5) + 3; 
        return Math.min(prev + increment, 100);
      });
    }, 90); // Loop speed

    return () => clearInterval(interval);
  }, []);

  // 2. Keyboard Key Listener to "Crank Engine" on 100%
  useEffect(() => {
    // Only listen for keys if loading is done
    if (!isLoaded) return;

    const handleKeyDown = (e) => {
      // Check if spacebar was pressed
      if (e.code === 'Space') {
        // Trigger microbus route jump to the main menu
        navigate('/menu');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup function removes listener when navigating away
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoaded, navigate]);

  return (
    <div className="preloader-container">
      
      {/* Background layer with specifically 10% opacity */}
      <div className="preloader-background-layer" />

      {/* Main Content Area */}
      <div className="preloader-wrapper">
        
        {/* Title: يا مخالفتي! */}
        <h1 className="preloader-title">يا مخالفتي !</h1>

        {/* Dynamic Microbus Image Character Graphic */}
        <img 
          src={microbusImg} 
          alt="Microbus character" 
          className={`preloader-bus-image ${isLoaded ? 'ready' : 'loading'}`}
        />

        {/* Core Loading Bar Layout */}
        <div className="loading-track">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Status Text with Dynamic Percentage */}
        <div className="status-box">
          <span className="loading-text">Loading...</span>
          <span className="loading-percentage">{progress}%</span>
        </div>

        {/* Tip / Action Box with specific orange stroke */}
        <div className="tip-box" onClick={() => navigate('/menu')}>
          {!isLoaded ? (
            <p className="tip-text">Tip: Avoid police cars!</p>
          ) : (
            <p className="ready-text">
              Press <strong>[ SPACEBAR ]</strong> or Click to Crank Engine! 
            </p>
          )}
        </div>

      </div>
    </div>
  );
}