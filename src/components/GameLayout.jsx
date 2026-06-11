import React from 'react';
import './GameLayout.css';

export default function GameLayout({
  children,
  hud,
  progressBar,
  className = ''
}) {
  return (
    <div className={`game-layout page-transition-fade ${className}`}>

      {hud && (
        <div className="game-layout-hud">
          {hud}
        </div>
      )}

      {progressBar && (
        <div className="game-layout-progress">
          {progressBar}
        </div>
      )}

      <main className="game-layout-content">
        {children}
      </main>

    </div>
  );
}