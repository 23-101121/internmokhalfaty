// src/pages/Phrases.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Phrases.css';

// Image Assets Imports
import imgBackArrow from '../assets/icon_back_arrow.png';
import imgSpeakerIcon from '../assets/icon_volume.png';

// Audio Assets Imports
import audioOne from '../voices/one.mp3'; 
import audioTwo from '../voices/two.mp3'; 
import audioThree from '../voices/three.mp3'; 
import audioFour from '../voices/four.mp3'; 
import audioFive from '../voices/five.mp3'; 

export default function Phrases() {
  const navigate = useNavigate();
  
  // Local state to manage application-level master volume muting toggle
  const [isMuted, setIsMuted] = useState(false);

  // Phrases catalogue configuration: First 5 are active, Last 4 are locked
  const phrasesCatalog = [
    {
      id: 'road_empty',
      phraseAr: 'يا بااااشا الطريق فاضي!',
      phraseEn: 'The road is empty, Boss!',
      audioSource: audioOne,
      locked: false
    },
    {
      id: 'safety_first',
      phraseAr: 'أماني يا غالي',
      phraseEn: 'Safety first, dear',
      audioSource: audioTwo,
      locked: false
    },
    {
      id: 'collect_fare',
      phraseAr: 'لم الأجرة يا أسطى',
      phraseEn: 'Collect the fare, Driver',
      audioSource: audioThree,
      locked: false
    },
    {
      id: 'take_easy',
      phraseAr: 'على الهادي يا زبادي',
      phraseEn: 'Take it easy',
      audioSource: audioFour,
      locked: false
    },
    {
      id: 'left_boss',
      phraseAr: 'شمال يا معلم!',
      phraseEn: 'Left, boss!',
      audioSource: audioFive,
      locked: false
    },
    {
      id: 'lock_lvl2',
      phraseAr: '',
      phraseEn: 'Unlocked in level 2',
      audioSource: '',
      locked: true,
      unlockLevel: 2
    },
    {
      id: 'lock_lvl3',
      phraseAr: '',
      phraseEn: 'Unlocked in level 3',
      audioSource: '',
      locked: true,
      unlockLevel: 3
    },
    {
      id: 'lock_lvl4',
      phraseAr: '',
      phraseEn: 'Unlocked in level 4',
      audioSource: '',
      locked: true,
      unlockLevel: 4
    },
    {
      id: 'lock_lvl5',
      phraseAr: '',
      phraseEn: 'Unlocked in level 5',
      audioSource: '',
      locked: true,
      unlockLevel: 5
    }
  ];

  // Global browser audio playback driver wrapper instance
  const playPhraseAudio = (audioAsset) => {
    if (!audioAsset || isMuted) return; 
    
    const audio = new Audio(audioAsset);
    audio.currentTime = 0; // Rewind tracks instantly to enable rapid responsive clicks
    audio.play().catch(err => console.log("Audio playback run execution blocked:", err));
  };

  const toggleMasterMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="phrases-screen-container">
      <div className="phrases-bg-layer" />

      {/* HEADER SECTION DECK */}
      <header className="phrases-header-zone">
        <button className="phrases-back-btn" onClick={() => navigate('/menu')}>
          <img src={imgBackArrow} alt="" className="back-arrow-img" />
          <span className="back-btn-text">Back</span>
        </button>

        <div className="phrases-center-titles">
          <h1 className="phrases-main-title">Phrases Library</h1>
          <p className="phrases-arabic-subtitle">مكتبة الإفهات المصرية</p>
        </div>

        <button 
          className={`phrases-master-audio-btn ${isMuted ? 'is-muted-state' : ''}`} 
          onClick={toggleMasterMute}
          title={isMuted ? "Unmute Library" : "Mute Library"}
        >
          <img src={imgSpeakerIcon} alt="Master Volume" className="master-speaker-img" />
          {isMuted && <div className="mute-cross-diagonal-line" />}
        </button>
      </header>

      {/* 3x3 DASHBOARD GRID HUB */}
      <main className="phrases-shop-grid">
        {phrasesCatalog.map((item) => {
          if (item.locked) {
            return (
              <div key={item.id} className="phrase-card locked-state">
                <div className="lock-icon-wrapper">
                  <svg className="lock-vector-graphic" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
                  </svg>
                </div>
                <p className="lock-text-lbl">Unlocked in level {item.unlockLevel}</p>
              </div>
            );
          }

          return (
            <div 
              key={item.id} 
              className="phrase-card active-playable"
              onClick={() => playPhraseAudio(item.audioSource)}
            >
              <div className="phrase-top-row">
                <h2 className="phrase-text-ar">{item.phraseAr}</h2>
                <button className="phrase-speaker-trigger">
                  <img src={imgSpeakerIcon} alt="Play" className="card-speaker-img" />
                </button>
              </div>
              <div className="phrase-translation-box">
                <p className="phrase-text-en">{item.phraseEn}</p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}