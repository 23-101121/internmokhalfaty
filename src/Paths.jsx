// src/Paths.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import the splash loader screen component
import Preloader from './pages/Preloader';
import MainMenu from './pages/MainMenu';
import LevelSelect from './pages/LevelSelect';
import DriverManual from './pages/DriverManual';
import Settings from './pages/Settings';
import Plates from './pages/Plates';
import Workshop from './pages/Workshop';
import Characters from './pages/Characters';
import Phrases from './pages/Phrases';
import Instructions from './pages/Instructions';
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';

export default function Paths() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/manual" element={<DriverManual />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/plates" element={<Plates />} />
       <Route path="/workshop" element={<Workshop />} />
        <Route path="/ahwa" element={<Characters />} />
       <Route path="/phrases" element={<Phrases />} />
       <Route path="/instructions" element={<Instructions />} />
       <Route path="/level1" element={<Level1 />} />
              <Route path="/level2" element={<Level2 />} />







      </Routes>
    </BrowserRouter>
  );
}