import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverManual.css';

import imgBackArrow from '../assets/icon_back_arrow.png';
import imgBarrier from '../assets/asset_barrier.png';
import imgSpeedSign from '../assets/asset_speed_sign.png';
import imgCamera from '../assets/asset_camera.png';
import imgDashboard from '../assets/asset_dashboard.png';

export default function DriverManual() {
  const navigate = useNavigate();

  return (
    <div className="manual-screen-container">
      <div className="manual-bg-layer" />

      <div className="manual-header-zone">
        <button className="manual-back-btn" onClick={() => navigate('/menu')}>
          <img src={imgBackArrow} alt="" className="back-arrow-img" />
          <span className="back-btn-text">Back</span>
        </button>

        <div className="manual-titles-wrapper">
          <h1 className="manual-main-title">DRIVER'S MANUAL</h1>
          <h2 className="manual-sub-title">دليل السواقة</h2>
        </div>
      </div>

      <div className="manual-rules-stack">
        
        <div className="manual-rule-row">
          <div className="rule-asset-container">
            <img src={imgBarrier} alt="Yellow Traffic Barrier" className="rule-icon-graphic" />
          </div>
          <p className="rule-description-text">
            Watch out for the Yellow Barriers. Crashing into these or flying through "Checkpoints" 
            too fast will damage your microbus. Take it easy to keep the van running!
          </p>
        </div>

        <div className="manual-rule-row">
          <div className="rule-asset-container">
            <img src={imgSpeedSign} alt="Speed Limit Radar Sign" className="rule-icon-graphic" />
          </div>
          <p className="rule-description-text">
            Keep your eyes on the road! These signs tell you the legal speed limit for the current 
            stretch of the highway. Remember: the limits get lower and harder as you level up.
          </p>
        </div>

        <div className="manual-rule-row">
          <div className="rule-asset-container">
            <img src={imgCamera} alt="Speed Radar Trap Camera" className="rule-icon-graphic" />
          </div>
          <p className="rule-description-text">
            This is your biggest enemy. If your speed is higher than the current limit when you 
            pass a camera, it will flash. One flash equals one Mokhalfa (Fine) and a lost life!
          </p>
        </div>

        <div className="manual-rule-row">
          <div className="rule-asset-container">
            <img src={imgDashboard} alt="Dashboard Speedometer Gauge" className="rule-icon-graphic" />
          </div>
          <p className="rule-description-text">
            This is your dashboard. Always keep the needle below the limit shown on the signs. 
            Do this to keep your License hearts full and the passengers happy.
          </p>
        </div>

      </div>
    </div>
  );
}