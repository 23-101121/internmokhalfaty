// src/pages/LevelSelect.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LevelSelect.css';
import watermarkLogo from '../assets/logo_watermark.png'; 
import imgFlag from '../assets/icon_flag.png';
import imgStarActive from '../assets/star_active.png';
import imgStarGrey from '../assets/star_grey.png';
import imgLevelsTitleIcon from '../assets/icon_levels.png';

export default function LevelSelect() {
  const navigate = useNavigate();

  const levelsData = [
    { id: 1, starsEarned: 3, isUnlocked: true },
    { id: 2, starsEarned: 3, isUnlocked: true },
    { id: 3, starsEarned: 0, isUnlocked: true },
    { id: 4, starsEarned: 0, isUnlocked: true },
    { id: 5, starsEarned: 0, isUnlocked: true },
    { id: 6, starsEarned: 0, isUnlocked: true },
    { id: 7, starsEarned: 0, isUnlocked: true },
    { id: 8, starsEarned: 0, isUnlocked: true },
    { id: 9, starsEarned: 0, isUnlocked: true },
  ];

  const renderStars = (score) => {
    const starNodes = [];
    for (let i = 1; i <= 3; i++) {
      starNodes.push(
        <img 
          key={i}
          src={i <= score ? imgStarActive : imgStarGrey} 
          alt="" 
          className="star-asset-img"
        />
      );
    }
    return starNodes;
  };

  return (
    <div className="levels-screen-container">
      <div className="levels-bg-layer" />

      <div className="menu-watermark">
             <img src={watermarkLogo} alt="" className="watermark-icon" onError={(e) => e.target.style.display='none'} />
             <span className="watermark-text">YA MOKHALFATY</span>
           </div>
      <div className="level-modal-board">
        
        <div className="modal-header-bar">
          <div className="modal-title-group">
            <img src={imgLevelsTitleIcon} alt="" className="modal-title-icon" />
            <span className="modal-title-text">Choose Level</span>
          </div>
          <button className="modal-close-btn" onClick={() => navigate('/menu')}>✕</button>
        </div>

        <div className="levels-grid-mesh">
          {levelsData.map((lvl) => (
            <div 
              key={lvl.id} 
              className={`level-grid-tile ${lvl.isUnlocked ? 'unlocked' : ''}`}
              onClick={() => lvl.isUnlocked && navigate('/play')}
            >
              <img src={imgFlag} alt="" className="level-tile-flag" />
              <span className="level-tile-number">{lvl.id}</span>
              <div className="level-stars-row">
                {renderStars(lvl.starsEarned)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}