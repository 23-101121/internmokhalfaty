// src/pages/Plates.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import './Plates.css';

import imgBackArrow from '../assets/icon_back_arrow.png';
import imgVolumeIcon from '../assets/icon_bag.png';

// Custom images uploaded by the user
import imgCoin from '../assets/ChatGPT Image Jun 2, 2026, 12_32_04 PM.png';
import imgWallet from '../assets/ChatGPT Image Jun 2, 2026, 12_59_34 PM.png';

export default function Plates() {
  const navigate = useNavigate();
  
  const { 
    wallet, 
    ownedPlates, 
    activePlate, 
    chargeMoney, 
    setOwnedPlates, 
    setActivePlate 
  } = useContext(GameContext);

  const [activeModal, setActiveModal] = useState(null); // 'mefales' | 'basha' | null

  const particleCount = Array.from({ length: 6 });

  const platesCatalog = [
    { id: 'default_plate', labelEn: 'Classic White', labelAr: 'مصر', valueNum: '١٢٣', valueChar: 'ج ن ة', price: 0, rarity: 'common', topColor: '#E2E8F0' },
    { id: 'cairo_gold', labelEn: 'Cairo Gold', labelAr: 'القاهرة', valueNum: 'VVV', valueChar: 'ف ر ج', price: 2500, rarity: 'rare', topColor: '#F6AD55' },
    { id: 'nile_blue', labelEn: 'Nile Blue', labelAr: 'النيل', valueNum: '٤٥٦', valueChar: 'ن ي ل', price: 0, rarity: 'common', topColor: '#63B3ED' }, 
    { id: 'microbus_orange', labelEn: 'Microbus Orange', labelAr: 'ميكروباص', valueNum: '٣٣٣', valueChar: 'س ر ع', price: 0, rarity: 'common', topColor: '#ED8936' },
    { id: 'desert_storm', labelEn: 'Desert Storm', labelAr: 'الصحراء', valueNum: '٩٩٩', valueChar: 'ن د ى', price: 5000, rarity: 'rare', topColor: '#C05621' },
    { id: 'taxi_yellow', labelEn: 'Taxi Yellow', labelAr: 'TAXI', valueNum: '٦٦٦', valueChar: 'د س ا', price: 1000, rarity: 'common', topColor: '#FFF600' },
    { id: 'vip_chrome', labelEn: 'VIP Chrome', labelAr: 'V.I.P', valueNum: '١', valueChar: 'VIP', price: 0, rarity: 'legendary', topColor: '#CBD5E0' },
    { id: 'police_black', labelEn: 'Police Black', labelAr: 'POLICE', valueNum: '٠٠٠', valueChar: 'ش ر ط', price: 10300, rarity: 'legendary', topColor: '#1A202C' }
  ];

  const handleItemInteraction = (plate) => {
    const isOwned = ownedPlates.includes(plate.id);

    if (isOwned) {
      setActivePlate(plate.id);
    } else {
      const success = chargeMoney(plate.price);
      if (success) {
        setOwnedPlates([...ownedPlates, plate.id]);
        setActivePlate(plate.id);
        setActiveModal('basha');
      } else {
        setActiveModal('mefales'); 
      }
    }
  };

  return (
    /* Outermost wrapper modified with 'page-transition-pop' for the explosive elastic scaling entry */
    <div className="plates-screen-container page-transition-pop">
      <div className="plates-bg-layer" />

      <div className="plates-header-zone">
        <button className="plates-back-btn" onClick={() => navigate('/menu')}>
          <img src={imgBackArrow} alt="" className="back-arrow-img" />
          <span className="back-btn-text">Back</span>
        </button>

        <div className="plates-center-titles">
          <h1 className="plates-main-title">License Plates</h1>
          <h2 className="plates-sub-title">Customize Your Ride</h2>
          <span className="plates-arabic-title">لوحات السيارة المخصصة</span>
        </div>

        <div className="plates-wallet-badge">
          <img src={imgVolumeIcon} alt="Wallet Bag" className="wallet-badge-icon" />
          <span className="wallet-badge-value">{wallet} EGP</span>
        </div>
      </div>

      <div className="plates-shop-grid">
        {platesCatalog.map((plate) => {
          const isOwned = ownedPlates.includes(plate.id);
          const isActive = activePlate === plate.id;

          return (
            <div 
              key={plate.id} 
              className={`plate-market-card ${isActive ? 'selected-active' : ''}`}
            >
              <span className={`plate-rarity-tag ${plate.rarity}`}>{plate.rarity}</span>

              {isActive && <div className="plate-selected-checkmark">✓</div>}

              <span className="plate-meta-label-en">{plate.labelEn}</span>

              <div className="plate-visual-canvas">
                <div className="plate-canvas-top-bar" style={{ backgroundColor: plate.topColor }}>
                  {plate.labelAr}
                </div>
                <div className="plate-canvas-numbers-box">
                  <div className="plate-canvas-split-cell">{plate.valueNum}</div>
                  <div className="plate-canvas-split-cell">{plate.valueChar}</div>
                </div>
              </div>

              {isActive ? (
                <button className="plate-action-trigger-btn active-state">Active</button>
              ) : isOwned ? (
                <button 
                  className="plate-action-trigger-btn owned-state"
                  onClick={() => handleItemInteraction(plate)}
                >
                  Owned / Equip
                </button>
              ) : (
                <button 
                  className="plate-action-trigger-btn buy-state"
                  onClick={() => handleItemInteraction(plate)}
                >
                  Buy - {plate.price.toLocaleString()} EGP
                </button>
              )}
            </div>
          );
        })}
      </div>

      {activeModal && (
        <div className="shop-popup-dimmer-overlay">
          
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

          <div className="shop-popup-alert-card">
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