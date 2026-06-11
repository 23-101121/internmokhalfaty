// src/components/ProgressBar/ProgressBar.jsx

import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({
  progress = 0,
  label = 'Road Progress'
}) {
  return (
    <div className="game-progress-wrapper">

      <div className="game-progress-header">
        <span className="game-progress-label">
          {label}
        </span>

        <span className="game-progress-value">
          {Math.floor(progress)}%
        </span>
      </div>

      <div className="game-progress-track">
        <div
          className="game-progress-fill"
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        />
      </div>

    </div>
  );
}