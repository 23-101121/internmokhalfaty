// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

import imgHome from '../assets/icon_home.png';
import imgPlate from '../assets/icon_plate.png';
import imgShop from '../assets/icon_shop.png';
import imgChat from '../assets/icon_chat.png';
import imgUser from '../assets/icon_user.png';
import imgVolume from '../assets/icon_volume.png';

export default function Settings() {
  const navigate = useNavigate();
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="settings-screen-container">
      <div className="settings-bg-layer" />

      <div className="settings-watermark">
        <span className="settings-watermark-text">YA MOKHALFATY</span>
      </div>

      <div className="settings-receipt-card">
        
        <div className="receipt-header">
          <hr className="receipt-line-decor" />
          <h1 className="receipt-title-ar">يا مخالفتي !</h1>
          <h2 className="receipt-title-en">Main Menu</h2>
          <hr className="receipt-line-decor" />
        </div>

        <hr className="receipt-tear-divider" />

        <div className="receipt-menu-list">
          
          {/* Navigates to Main Menu Hub Screen */}
          <button className="receipt-row-item" onClick={() => navigate('/menu')}>
            <img src={imgHome} alt="" className="receipt-row-icon" />
            <span className="receipt-row-text">Main Menu</span>
          </button>

          {/* Navigates to License Plates Customization Screen */}
          <button className="receipt-row-item" onClick={() => navigate('/plates')}>
            <img src={imgPlate} alt="" className="receipt-row-icon" />
            <span className="receipt-row-text">Plates</span>
          </button>

          {/* Navigates to Microbus Workshop Mechanics Screen */}
          <button className="receipt-row-item" onClick={() => navigate('/workshop')}>
            <img src={imgShop} alt="" className="receipt-row-icon" />
            <span className="receipt-row-text">Workshop</span>
          </button>

          {/* Navigates to Driver Custom Audio Phrases Screen */}
          <button className="receipt-row-item" onClick={() => navigate('/phrases')}>
            <img src={imgChat} alt="" className="receipt-row-icon" />
            <span className="receipt-row-text">Phrases</span>
          </button>

          {/* Navigates to El Ahwa / Profile Leaderboard Screen */}
          <button className="receipt-row-item" onClick={() => navigate('/ahwa')}>
            <img src={imgUser} alt="" className="receipt-row-icon" />
            <span className="receipt-row-text">El Ahwa</span>
          </button>

          <hr className="receipt-tear-divider" />

          <div className="audio-toggle-container">
            <img src={imgVolume} alt="" className="receipt-row-icon" />
            
            <label className="switch-toggle-wrapper">
              <input 
                type="checkbox" 
                className="switch-input-element"
                checked={isAudioOn}
                onChange={() => setIsAudioOn(!isAudioOn)} 
              />
              <span className="custom-switch-track">
                <span className="custom-switch-thumb" />
              </span>
            </label>
          </div>

        </div>

        <hr className="receipt-tear-divider" />

        <div className="receipt-footer">
          <div className="receipt-date-stamp">السبت ٥ أبريل ٢٠٢٦</div>
          <div className="receipt-barcode-dots">************</div>
        </div>

      </div>
    </div>
  );
}