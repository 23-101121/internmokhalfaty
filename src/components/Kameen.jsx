import React from 'react';
import './Kameen.css';

import kameenImg from '../assets/kameen.png';

export default function Kameen({ visible }) {
  if (!visible) return null;

  return (
    <div className="kameen-container">
      <img
        src={kameenImg}
        alt="Police Checkpoint"
        className="kameen-image"
      />
    </div>
  );
}