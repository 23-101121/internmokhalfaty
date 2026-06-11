import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import './LevelSelect.css';
import watermarkLogo from '../assets/logo_watermark.png'; 
import imgFlag from '../assets/icon_flag.png';
import imgStarActive from '../assets/star_active.png';
import imgStarGrey from '../assets/star_grey.png';
import imgLevelsTitleIcon from '../assets/icon_levels.png';

export default function LevelSelect() {
  const navigate = useNavigate();
  
  // Extract dynamic progressive states directly from the updated context setup
  const { unlockedLevels, levelStars } = useContext(GameContext);

  // Generate our map of 9 dynamic levels structure setup on demand
  const levelsData = Array.from({ length: 9 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      isUnlocked: unlockedLevels.includes(id),
      starsEarned: levelStars[id] || 0
    };
  });

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
              className={`level-grid-tile ${lvl.isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => lvl.isUnlocked && navigate('/instructions', { state: { selectedLevelId: lvl.id } })}
              style={{ cursor: lvl.isUnlocked ? 'pointer' : 'not-allowed' }}
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