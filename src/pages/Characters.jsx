import React, { useState } from 'react';
import './Characters.css';

import imgBackArrow from '../assets/icon_back_arrow.png'; 
import imgWalletIcon from '../assets/icon_bag.png';
import imgActiveStar from '../assets/star_active.png';     
import imgGreyStar from '../assets/star_grey.png';       

import imgCoin from '../assets/ChatGPT Image Jun 2, 2026, 12_32_04 PM.png';
import imgWallet from '../assets/ChatGPT Image Jun 2, 2026, 12_59_34 PM.png';

import imgHothead from '../assets/char_hothead.png';
import imgHanafi from '../assets/char_hanafi.png';
import imgNour from '../assets/char_nour.png';

export default function Characters() {
  const [playerWallet, setPlayerWallet] = useState(500); 
  const [selectedCharId, setSelectedCharId] = useState(1);
  const [ownedCharacters, setOwnedCharacters] = useState([1]); 

  const [activeModal, setActiveModal] = useState(null);
  
  const particleCount = Array.from({ length: 6 });

  const characterList = [
    {
      id: 1,
      nameEn: 'The Hothead',
      nameAr: 'السرنجي',
      descAr: 'شاب متهور يحب السرعة والمغامرة',
      image: imgHothead,
      price: 0,
      gradientClass: 'gradient-hothead',
      stats: { aggression: 5, luck: 3 }
    },
    {
      id: 2,
      nameEn: 'Uncle Hanafi',
      nameAr: 'العم حنفي',
      descAr: 'سائق قديم خبرة ٣٠ سنة في الشوارع',
      image: imgHanafi,
      price: 15000,
      gradientClass: 'gradient-hanafi',
      stats: { aggression: 2, luck: 5 }
    },
    {
      id: 3,
      nameEn: 'Captain Nour',
      nameAr: 'العم نور',
      descAr: 'سالفة شجاعة لتحدي كل الصعاب',
      image: imgNour,
      price: 15000,
      gradientClass: 'gradient-nour',
      stats: { aggression: 3, luck: 5 }
    }
  ];

  const handleActionClick = (character) => {
    const isOwned = ownedCharacters.includes(character.id);

    if (isOwned) {
      setSelectedCharId(character.id);
    } else {
      if (playerWallet >= character.price) {
        setPlayerWallet(prev => prev - character.price);
        setOwnedCharacters(prev => [...prev, character.id]);
        setSelectedCharId(character.id);
        setActiveModal('basha');
      } else {
        setActiveModal('mefales');
      }
    }
  };

  const renderStarRating = (ratingScore) => {
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < ratingScore;
      return (
        <img 
          key={index}
          src={isFilled ? imgActiveStar : imgGreyStar} 
          alt="star asset" 
          className="stat-star-asset-icon"
        />
      );
    });
  };

  return (
    <div className="chars-screen-container">
      <div className="chars-bg-layer" />

      <header className="chars-header-zone">
        <button className="chars-back-btn" onClick={() => window.history.back()}>
          <img src={imgBackArrow} alt="" className="back-arrow-img" />
          <span className="back-btn-text">Back</span>
        </button>

        <div className="chars-center-titles">
          <h1 className="chars-main-title">Al Ahwa</h1>
          <span className="chars-sub-title">Character Selection</span>
          <span className="chars-arabic-title">اختر سائقك</span>
        </div>

        <div className="chars-wallet-badge">
          <img src={imgWalletIcon} alt="Wallet Bag" className="wallet-badge-icon" />
          <span className="wallet-badge-value">{playerWallet.toLocaleString()} EGP</span>
        </div>
      </header>

      <main className="chars-shop-grid">
        {characterList.map((char) => {
          const isOwned = ownedCharacters.includes(char.id);
          const isActive = selectedCharId === char.id;

          return (
            <div 
              key={char.id} 
              className={`char-market-card ${char.gradientClass} ${isActive ? 'selected-active' : ''}`}
            >
              {isActive && (
                <div className="char-selected-checkmark">
                  ✓
                </div>
              )}

              <div className="char-avatar-frame">
                <img src={char.image} alt={char.nameEn} className="char-illustration-img" />
              </div>

              <div className="char-meta-identity-box">
                <h2 className="char-name-en">{char.nameEn}</h2>
                <h3 className="char-name-ar">{char.nameAr}</h3>
                <p className="char-desc-ar">{char.descAr}</p>
              </div>

              <div className="char-stats-panel-block">
                <div className="stat-row-metric">
                  <span className="stat-label-lbl">(Aggression) العدوانية</span>
                  <div className="stars-row-flex-box">
                    {renderStarRating(char.stats.aggression)}
                  </div>
                </div>

                <div className="stat-row-metric">
                  <span className="stat-label-lbl">(Luck) الحظ</span>
                  <div className="stars-row-flex-box">
                    {renderStarRating(char.stats.luck)}
                  </div>
                </div>
              </div>

              {isOwned ? (
                <button 
                  className={`char-action-trigger-btn ${isActive ? 'active-state' : 'owned-state'}`}
                  onClick={() => handleActionClick(char)}
                  disabled={isActive}
                >
                  {isActive ? 'Selected' : 'Select Driver'}
                </button>
              ) : (
                <button 
                  className="char-action-trigger-btn buy-state"
                  onClick={() => handleActionClick(char)}
                >
                   BUY - {char.price.toLocaleString()} EGP
                </button>
              )}
            </div>
          );
        })}
      </main>

      {activeModal && (
        <div className="shop-popup-dimmer-overlay" onClick={() => setActiveModal(null)}>
          
          <div className="modal-particles-wrapper">
            {particleCount.map((_, index) => (
              <img
                key={index}
                src={activeModal === 'basha' ? imgCoin : imgWallet}
                alt=""
                className={`floating-particle-item item-index-${index}`}
              />
            ))}
          </div>

          <div className="shop-popup-alert-card" onClick={(e) => e.stopPropagation()}>
            {activeModal === 'mefales' ? (
              <>
                <h1 className="shop-popup-headline-text mefales-profile">MEFALES!</h1>
                <p className="shop-popup-subline-text">Play To Earn Money</p>
              </>
            ) : (
              <>
                <h1 className="shop-popup-headline-text basha-profile">beta3tak ya basha!</h1>
                <p className="shop-popup-subline-text">Purchase successful</p>
              </>
            )}

            <button 
              className="shop-popup-dismiss-btn"
              onClick={() => setActiveModal(null)}
            >
              Back Home
            </button>
          </div>
        </div> 
      )}
    </div>
  );
}