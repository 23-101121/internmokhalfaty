// src/Paths.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import the splash loader screen component
import Preloader from './pages/Preloader';
import MainMenu from './pages/MainMenu';
import LevelSelect from './pages/LevelSelect';
import DriverManual from './pages/DriverManual';
import Settings from './pages/Settings';

export default function Paths() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/manual" element={<DriverManual />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}