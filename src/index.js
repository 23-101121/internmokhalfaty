import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';

import Paths from './Paths'; 
import { GameProvider } from './context/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider>
      <Paths />
    </GameProvider>
  </React.StrictMode>
);