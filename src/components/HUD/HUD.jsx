import React from 'react';
import './HUD.css';

import heartIcon from '../../assets/heart_icon.png';
import licenseIcon from '../../assets/license_icon.png';

export default function HUD({
  lives = 3,
  licenseHealth = 3,
  money = null,
  fuel = null,
  violations = null,
  passengers = null
}) {
  return (
    <div className="hud-container">

      <div className="hud-left-section">

        <div className="hud-stat-card">
          <img
            src={licenseIcon}
            alt="License"
            className="hud-icon"
          />
          <span className="hud-value">
            {licenseHealth}
          </span>
        </div>

        <div className="hud-stat-card">
          <img
            src={heartIcon}
            alt="Lives"
            className="hud-icon"
          />
          <span className="hud-value">
            {lives}
          </span>
        </div>

      </div>

      <div className="hud-right-section">

        {money !== null && (
          <div className="hud-stat-card">
            <span className="hud-label">Money</span>
            <span className="hud-value">
              {money} EGP
            </span>
          </div>
        )}

        {fuel !== null && (
          <div className="hud-stat-card">
            <span className="hud-label">Fuel</span>
            <span className="hud-value">
              {Math.floor(fuel)}%
            </span>
          </div>
        )}

        {violations !== null && (
          <div className="hud-stat-card">
            <span className="hud-label">Violations</span>
            <span className="hud-value">
              {violations}
            </span>
          </div>
        )}

        {passengers !== null && (
          <div className="hud-stat-card">
            <span className="hud-label">Passengers</span>
            <span className="hud-value">
              {passengers}
            </span>
          </div>
        )}

      </div>

    </div>
  );
}