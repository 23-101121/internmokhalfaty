import React from 'react';
import './Road.css';

export default function Road({ children }) {
  return (
    <div className="road-wrapper">

      <div className="road-surface">

        {/* Left Yellow Border */}
        <div className="road-edge left-edge" />

        {/* Right Yellow Border */}
        <div className="road-edge right-edge" />

        {/* Lane Divider 1 */}
        <div className="lane-divider lane-1" />

        {/* Lane Divider 2 */}
        <div className="lane-divider lane-2" />

        {children}

      </div>

    </div>
  );
}