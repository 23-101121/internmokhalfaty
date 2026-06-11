
import React from 'react';
import './Camera.css';

import cameraImg from '../../assets/asset_camera.png';

export default function Camera({ y }) {
  return (
    <div
      className="camera-object"
      style={{ top: `${y}px` }}
    >
      <img
        src={cameraImg}
        alt="Camera"
        className="camera-image"
      />
    </div>
  );
}