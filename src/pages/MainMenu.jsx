import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

import mainBusImg from '../assets/microbus_preloader.png';
import watermarkLogo from '../assets/logo_watermark.png'; 
import iconPlay from '../assets/icon_play.png';
import iconLevels from '../assets/icon_levels.png';
import iconSettings from '../assets/icon_settings.png';
import iconHelp from '../assets/icon_help.png';

export default function MainMenu() {
  const navigate = useNavigate();
  const [animateBus, setAnimateBus] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBus(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    /* Added page-transition-fade here for a smooth screen entry animation */
    <div className="menu-container page-transition-fade">
      {/* Background road environment scene */}
      <div className="menu-background-layer" />

      <div className="menu-watermark">
        <img src={watermarkLogo} alt="" className="watermark-icon" onError={(e) => e.target.style.display='none'} />
        <span className="watermark-text">YA MOKHALFATY</span>
      </div>

      <img 
        src={mainBusImg} 
        alt="Microbus Vehicle" 
        className={`menu-left-hero ${animateBus ? 'slide-in' : ''}`} 
      />

      {/* Typography & Buttons column aligned to the right side */}
      <div className="menu-content-wrapper">
        
        {/* Titles Group */}
        <div className="menu-titles-stack">
          <h1 className="menu-main-title">يا مخالفتي !</h1>
          <h2 className="menu-sub-title">صاروخ الدائري</h2>
        </div>

        {/* Buttons List Panel */}
        <div className="menu-buttons-list">
          
          {/* Start Game Button (Navigates to Level Selection) */}
          <button className="menu-btn menu-btn-start" onClick={() => navigate('/levels')}>
            <img src={iconPlay} alt="" className="btn-icon-asset" />
            Start Game
          </button>
          
          {/* Levels Button (Navigates to Level Selection) */}
          <button className="menu-btn menu-btn-nav" onClick={() => navigate('/levels')}>
            <img src={iconLevels} alt="" className="btn-icon-asset" />
            Levels
          </button>
          
          {/* Settings Button (Navigates to Settings Screen) */}
          <button className="menu-btn menu-btn-nav" onClick={() => navigate('/settings')}>
            <img src={iconSettings} alt="" className="btn-icon-asset" />
            Settings
          </button>

        </div>
      </div>

      {/* Bottom Right Help Utility (Navigates to Driver Manual Screen) */}
      <button className="menu-help-trigger" onClick={() => navigate('/manual')}>
        <img src={iconHelp} alt="Help/Manual Document" className="help-icon-img" />
      </button>

    </div>
  );
}