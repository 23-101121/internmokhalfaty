import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import './Workshop.css';

import imgBackArrow from '../assets/icon_back_arrow.png';
import imgVolumeIcon from '../assets/icon_bag.png';

import imgIconSpeed from '../assets/icon_speed.png';
import imgIconBrakes from '../assets/icon_brakes.png';
import imgIconNitro from '../assets/icon_nitro.png';

import imgPreloaderBg from '../assets/microbus_preloader.png';

import imgCoin from '../assets/ChatGPT Image Jun 2, 2026, 12_32_04 PM.png';
import imgWallet from '../assets/ChatGPT Image Jun 2, 2026, 12_59_34 PM.png';

export default function Workshop() {
  const navigate = useNavigate();
  
  const { wallet, chargeMoney } = useContext(GameContext);

  const [activeModal, setActiveModal] = useState(null); 

  const particleCount = Array.from({ length: 6 });

  const [upgrades, setUpgrades] = useState({
    speed: 6,
    brakes: 4,
    nitro: 3
  });

  const [stickers, setStickers] = useState({
    einyBarda: true,
    yaRaytny: false,
    mashyAlaBarakatAllah: true,
    sarokh: false
  });

  const handleUpgradeAction = (type, cost) => {
    if (upgrades[type] >= 10) return; // Cap maximum levels at 10/10

    const success = chargeMoney(cost);
    if (success) {
      setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));
      setActiveModal('basha');
    } else {
      setActiveModal('mefales');
    }
  };

  const handleStickerInteraction = (key, cost) => {
    if (stickers[key]) return;

    const success = chargeMoney(cost);
    if (success) {
      setStickers(prev => ({ ...prev, [key]: true }));
      setActiveModal('basha');
    } else {
      setActiveModal('mefales');
    }
  };

  return (
    <div className="workshop-screen-container">
      <div className="workshop-bg-layer" />

      <div className="workshop-header-zone">
        <button className="workshop-back-btn" onClick={() => navigate('/menu')}>
          <img src={imgBackArrow} alt="" className="back-arrow-img" />
          <span className="back-btn-text">Back</span>
        </button>

        <div className="workshop-center-titles">
          <h1 className="workshop-main-title">The Workshop</h1>
          <span className="workshop-arabic-title">الورشة</span>
        </div>

        <div className="workshop-wallet-badge">
          <img src={imgVolumeIcon} alt="Wallet Bag" className="wallet-badge-icon" />
          <span className="wallet-badge-value">{wallet} EGP</span>
        </div>
      </div>

      <div className="workshop-dashboard-workspace">
        
        <div className="workshop-panel-card left-panel">
          <h2 className="panel-headline">الترقيات الميكانيكية</h2>

          <div className="upgrade-item-row">
            <div className="upgrade-row-header">
              <div className="label-with-icon">
                <img src={imgIconSpeed} alt="" className="upgrade-row-icon" />
                <span className="upgrade-label-en">High Speed</span>
              </div>
              <span className="upgrade-label-ar">السرعة</span>
            </div>
            <span className="upgrade-fraction">{upgrades.speed}/10</span>
            <div className="progress-bar-track">
              <div className="progress-fill-indicator" style={{ width: `${upgrades.speed * 10}%` }} />
            </div>
            <button 
              className="workshop-action-trigger-btn"
              onClick={() => handleUpgradeAction('speed', 10)}
            >
              Upgrade - 10 egp
            </button>
          </div>

          <div className="upgrade-item-row">
            <div className="upgrade-row-header">
              <div className="label-with-icon">
                <img src={imgIconBrakes} alt="" className="upgrade-row-icon" />
                <span className="upgrade-label-en">Brakes</span>
              </div>
              <span className="upgrade-label-ar">الفرامل</span>
            </div>
            <span className="upgrade-fraction">{upgrades.brakes}/10</span>
            <div className="progress-bar-track">
              <div className="progress-fill-indicator" style={{ width: `${upgrades.brakes * 10}%` }} />
            </div>
            <button 
              className="workshop-action-trigger-btn"
              onClick={() => handleUpgradeAction('brakes', 10)}
            >
              Upgrade - 10 egp
            </button>
          </div>

          <div className="upgrade-item-row">
            <div className="upgrade-row-header">
              <div className="label-with-icon">
                <img src={imgIconNitro} alt="" className="upgrade-row-icon" />
                <span className="upgrade-label-en">Nitro Boost</span>
              </div>
              <span className="upgrade-label-ar">النيتروجين</span>
            </div>
            <span className="upgrade-fraction">{upgrades.nitro}/10</span>
            <div className="progress-bar-track">
              <div className="progress-fill-indicator" style={{ width: `${upgrades.nitro * 10}%` }} />
            </div>
            <button 
              className="workshop-action-trigger-btn"
              onClick={() => handleUpgradeAction('nitro', 1500)}
            >
              Upgrade - 1,500 egp
            </button>
          </div>
        </div>

        <div className="workshop-central-canvas-display">
          <div className="microbus-avatar-showcase-box">
            <img src={imgPreloaderBg} alt="Classic Microbus Ride" className="showcase-preloader-bg-img" />
          </div>

          <div className="vehicle-metrics-footer-card">
            <h3 className="vehicle-profile-name">Classic Microbus</h3>
            <div className="metrics-specs-flex-row">
              <div className="spec-item-cell">
                <span className="spec-title-lbl">Speed</span>
                <span className="spec-value-output orange-color">180</span>
              </div>
              <div className="spec-item-cell">
                <span className="spec-title-lbl">Efficiency</span>
                <span className="spec-value-output orange-color">85</span>
              </div>
              <div className="spec-item-cell">
                <span className="spec-title-lbl">Control</span>
                <span className="spec-value-output orange-color">70</span>
              </div>
            </div>
          </div>
        </div>

        <div className="workshop-panel-card right-panel">
          <h2 className="panel-headline">محل الاستيكرات</h2>

          <div className={`sticker-shop-item-card ${stickers.einyBarda ? 'is-acquired' : ''}`}>
            <span className="sticker-arabic-display-text text-orange">عيني باردة</span>
            <button className="sticker-status-action-badge">Owned</button>
          </div>

          <div className={`sticker-shop-item-card ${stickers.yaRaytny ? 'is-acquired' : ''}`}>
            <span className="sticker-arabic-display-text text-cyan">يا ريتني كنت معاك</span>
            <button 
              className="sticker-status-action-badge action-buy-trigger"
              onClick={() => handleStickerInteraction('yaRaytny', 10)}
            >
              Buy - 10 egp
            </button>
          </div>

          <div className={`sticker-shop-item-card ${stickers.mashyAlaBarakatAllah ? 'is-acquired' : ''}`}>
            <span className="sticker-arabic-display-text text-yellow">ماشي على بركة الله</span>
            <button className="sticker-status-action-badge">Owned</button>
          </div>

          <div className={`sticker-shop-item-card ${stickers.sarokh ? 'is-acquired' : ''}`}>
            <span className="sticker-arabic-display-text text-orange">صاروخ الدائري</span>
            <button 
              className="sticker-status-action-badge action-buy-trigger"
              onClick={() => handleStickerInteraction('sarokh', 90)}
            >
              Buy - 90 egp
            </button>
          </div>
        </div>
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