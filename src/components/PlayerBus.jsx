// src/components/PlayerBus/PlayerBus.jsx

import React from 'react';
import './PlayerBus.css';

import microbusImg from '../assets/microbus_top.png';
export default function PlayerBus({ lane }) {

  const laneClass = `lane-${lane}`;

  return (
    <div className={`player-bus ${laneClass}`}>
      <img
        src={microbusImg}
        alt="Microbus"
        className="player-bus-image"
      />
    </div>
  );
}