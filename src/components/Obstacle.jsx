

import React from 'react';
import './Obstacle.css';

import barrierImg from '../assets/asset_barrier.png';
export default function Obstacle({
  y,
  lane
}) {
  return (
    <div
      className={`obstacle lane-${lane}`}
      style={{ top: `${y}px` }}
    >
      <img
        src={barrierImg}
        alt="Obstacle"
        className="obstacle-image"
      />
    </div>
  );
}