import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Instructions.css';

import imgArrowRight from '../assets/arrow_right.png'; 
import imgArrowLeft from '../assets/arrow_left.png';

// Level metadata mapping engine
const LEVEL_METADATA_MAP = {
  1: { titleEn: 'Level One', titleAr: 'الدائري الشمالي', route: '/level1' },
  2: { titleEn: 'Level Two', titleAr: 'المحور', route: '/level2' },
  3: { titleEn: 'Level Three', titleAr: 'طريق السويس', route: '/level3' },
  4: { titleEn: 'Level Four', titleAr: 'مصر الإسماعيلية', route: '/level4' },
  5: { titleEn: 'Level Five', titleAr: 'كورنيش النيل', route: '/level5' },
  6: { titleEn: 'Level Six', titleAr: 'الاضافي السريع', route: '/level6' },
  7: { titleEn: 'Level Seven', titleAr: 'وسط البلد', route: '/level7' },
  8: { titleEn: 'Level Eight', titleAr: 'نفق الشهيد', route: '/level8' },
  9: { titleEn: 'Level Nine', titleAr: 'الطريق الساحلي', route: '/level9' },
};

export default function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract selectedLevelId safely from our router history state bundle
  const passedLevelId = location.state?.selectedLevelId || 1;

  // Gather matching map labels or fallback on default Level 1 setup safely
  const currentLevelInfo = LEVEL_METADATA_MAP[passedLevelId] || LEVEL_METADATA_MAP[1];

  const handleStartGame = () => {
    // Navigates precisely to the custom route path (e.g., /level1, /level2)
    navigate(currentLevelInfo.route, { state: { levelId: passedLevelId } });
  };

  return (
    <div className="instructions-screen-container page-transition-ignition">
      <div className="instructions-bg-overlay" />

      <div className="level-badge-header-card">
        <div className="flag-icon-wrapper">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </div>
        <div className="level-titles-stack">
          <span className="level-number-lbl">{currentLevelInfo.titleEn}</span>
          <h1 className="level-location-title-ar">{currentLevelInfo.titleAr}</h1>
        </div>
      </div>

      <div className="instructions-goal-panel">
        <div className="goal-panel-headline">
          <span className="target-bullseye-icon">◎</span>
          <h2>The Goal</h2>
        </div>

        <div className="goals-flex-grid">
          <div className="goal-item-cell">
            <span className="goal-index-badge">1</span>
            <p className="goal-instruction-text">Avoid El-Kameen</p>
          </div>
          <div className="goal-item-cell">
            <span className="goal-index-badge">2</span>
            <p className="goal-instruction-text">Protect Your License</p>
          </div>
          <div className="goal-item-cell">
            <span className="goal-index-badge">3</span>
            <p className="goal-instruction-text">Stick to the speed limit</p>
          </div>
        </div>
      </div>

      <div className="instructions-controls-row">
        <div className="control-direction-pill">
          <div className="arrow-key-box">
            <img src={imgArrowRight} alt="Right Arrow" className="control-arrow-icon" />
          </div>
          <span className="control-label-text">Right</span>
        </div>
        
        <div className="control-direction-pill">
          <div className="arrow-key-box">
            <img src={imgArrowLeft} alt="Left Arrow" className="control-arrow-icon" />
          </div>
          <span className="control-label-text">Left</span>
        </div>
      </div>

      <button className="start-game-trigger-btn" onClick={handleStartGame}>
        <span className="play-triangle-symbol">▶</span> Start Game
      </button>
    </div>
  );
}