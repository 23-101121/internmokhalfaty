import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

import GameLayout from '../components/GameLayout';
import Road from '../components/Road';
import PlayerBus from '../components/PlayerBus';
import Obstacle from '../components/Obstacle';
import Kameen from '../components/Kameen';
import HUD from '../components/HUD/HUD';

// Navigation and interface asset controls

import crashSfx from '../assets/crash.mp3'; 

// Wallet asset
import imgVolumeIcon from '../assets/icon_bag.png'; 

import './Level1.css';

// Smooth counting module that supports BOTH incrementing and decrementing values
function AnimatedWalletCounter({ targetValue, duration = 1200, changeAmount = 0, isLoss = false }) {
  const startValue = isLoss 
    ? targetValue + changeAmount 
    : Math.max(0, targetValue - changeAmount);
    
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Linear interpolation to smoothly transition amounts
      setCount(Math.floor(progress * (targetValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, startValue, duration]);

  return <>{count} EGP</>;
}

export default function Level1() {
  const navigate = useNavigate();
  
  const { 
    wallet, 
    licenseHealth, 
    unlockNextLevel, 
    earnMoney, 
    playSoundEffect 
  } = useContext(GameContext);

  // Core States: PLAYING, PAUSED, ARRIVED, WON, CRASHED, OVER
  const [gameState, setGameState] = useState('PLAYING'); 
  const [busLane, setBusLane] = useState(1); 
  const [progress, setProgress] = useState(0);
  const [lives, setLives] = useState(3);
  const [obstacles, setObstacles] = useState([]);
  const [isScreenShaking, setIsScreenShaking] = useState(false);

  const animationFrameRef = useRef();
  const lastTimeRef = useRef();
  const obstacleIdCounter = useRef(0);
  const spawnCooldownTimer = useRef(0);

  // Keyboard controls for steering and escape menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState !== 'PLAYING' && gameState !== 'PAUSED') return;
        setGameState((prev) => {
          if (prev === 'PLAYING') return 'PAUSED';
          if (prev === 'PAUSED') {
            lastTimeRef.current = undefined; 
            return 'PLAYING';
          }
          return prev;
        });
        return;
      }

      if (gameState !== 'PLAYING') return; 
      if (e.key === 'ArrowLeft') setBusLane((prev) => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setBusLane((prev) => Math.min(2, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Timed transition: Arrive at the checkpoint -> Win rewards
  useEffect(() => {
    if (gameState === 'ARRIVED') {
      const timer = setTimeout(() => {
        setGameState('WON');
        earnMoney(600); // Rewards +600 EGP
        unlockNextLevel(2); 
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, earnMoney, unlockNextLevel]);

  // Main game tick engine loop
  useEffect(() => {
    const coreGameTick = (timestamp) => {
      if (lastTimeRef.current === undefined) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (gameState === 'PLAYING') {
        setProgress((prev) => {
          const nextVal = prev + deltaTime * 5; 
          if (nextVal >= 90) {
            setGameState('ARRIVED');
            return 90;
          }
          return nextVal;
        });

        spawnCooldownTimer.current += deltaTime;
        if (spawnCooldownTimer.current >= 1.3 && progress < 85) {
          spawnCooldownTimer.current = 0;
          setObstacles((prevList) => [
            ...prevList,
            {
              id: obstacleIdCounter.current++,
              lane: Math.floor(Math.random() * 3), 
              y: -100 
            }
          ]);
        }

        setObstacles((prevList) =>
          prevList
            .map((item) => ({ ...item, y: item.y + deltaTime * 550 }))
            .filter((item) => {
              const windowHeight = window.innerHeight || 700;
              const hitZoneTop = windowHeight - 210;
              const hitZoneBottom = windowHeight - 40;

              if (item.y >= hitZoneTop && item.y <= hitZoneBottom && item.lane === busLane) {
                processCollisionImpact();
                return false; 
              }
              return item.y < windowHeight + 100;
            })
        );
      }

      animationFrameRef.current = requestAnimationFrame(coreGameTick);
    };

    animationFrameRef.current = requestAnimationFrame(coreGameTick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, busLane, progress]);

  const processCollisionImpact = () => {
    playSoundEffect(crashSfx);
    setIsScreenShaking(true);
    setGameState('CRASHED');
    setTimeout(() => setIsScreenShaking(false), 450);

    setLives((currentLives) => {
      const remaining = currentLives - 1;
      if (remaining <= 0) {
        setGameState('OVER');
        earnMoney(-250); // Deducts 250 EGP upon losing
      }
      return remaining;
    });
  };

  const handleResumeGame = () => {
    lastTimeRef.current = undefined; 
    setGameState('PLAYING');
  };

  const handleRestartLevel = () => {
    lastTimeRef.current = undefined;
    setProgress(0);
    setObstacles([]);
    setLives(3);
    setGameState('PLAYING');
  };

  return (
    <div className={`level1-root-canvas ${isScreenShaking ? 'impact-rumble' : ''}`}>
      <GameLayout
        hud={<HUD lives={lives} licenseHealth={licenseHealth} />}
        progressBar={null} 
      >
        {/* Floating Pause Control Button */}
        {gameState === 'PLAYING' && (
          <button 
            className="hud-pause-trigger-btn" 
            onClick={() => setGameState('PAUSED')}
            title="Pause Route (Esc)"
          >
            <div className="pause-bars-icon">
              <span /><span />
            </div>
          </button>
        )}

        {/* TOP RIGHT FLOATING WALLET BADGE - Visible exclusively after winning or losing */}
        {(gameState === 'WON' || gameState === 'OVER') && (
          <div className={`screen-top-right-wallet ${gameState === 'WON' ? 'wallet-glow-green' : ''} ${gameState === 'OVER' ? 'wallet-glow-red' : ''}`}>
            <div className="plates-wallet-badge">
              <img src={imgVolumeIcon} alt="Wallet Bag" className="wallet-badge-icon" />
              <span className="wallet-badge-value">
                <AnimatedWalletCounter 
                  targetValue={wallet} 
                  changeAmount={gameState === 'OVER' ? 250 : 600} 
                  isLoss={gameState === 'OVER'} 
                />
              </span>
            </div>
          </div>
        )}

        <Road scrollingPaused={gameState === 'PAUSED' || gameState === 'ARRIVED' || gameState === 'WON' || gameState === 'OVER'}>
          {obstacles.map((obs) => (
            <Obstacle key={obs.id} lane={obs.lane} y={obs.y} />
          ))}

          <PlayerBus lane={busLane} />
          <Kameen visible={gameState === 'ARRIVED' || gameState === 'WON'} />
        </Road>

        {/* Progress Tracker */}
        {gameState !== 'ARRIVED' && gameState !== 'WON' && gameState !== 'OVER' && (
          <div className="floating-progress-wrapper">
            <div className="progress-metrics-text">
              <span>الدائري الشمالي</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="progress-outer-groove">
              <div className="progress-fluid-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* VICTORY REPORT CARD MODAL */}
        {gameState === 'WON' && (
          <div className="game-alert-dimmer blur-backdrop">
            <div className="score-report-card border-green-accent">
              <div className="report-card-body">
                <h1 className="report-headline-main green-txt">Mabrouk ya wa7sh</h1>
                <h3 className="report-headline-arabic">مبروك يا وحش</h3>
                <span className="report-sub-title">Profit and Bonus Report</span>
                
                <hr className="report-divider-line" />
                
                <div className="report-metrics-list">
                  <div className="metric-item-row">
                    <div className="metric-badge-num">1</div>
                    <div className="metric-details-text">
                      <strong className="metric-title-en">COMPLYING WITH TRAFFIC LAWS</strong>
                      <span className="metric-title-ar">التزام بقواعد المرور</span>
                    </div>
                  </div>
                  <div className="metric-item-row">
                    <div className="metric-badge-num">2</div>
                    <div className="metric-details-text">
                      <strong className="metric-title-en">Valid License</strong>
                      <span className="metric-title-ar">الرخصة سارية</span>
                    </div>
                  </div>
                </div>

                <div className="fine-total-container-box bonus-bg">
                  <span className="fine-label-mix"><strong>المكافأة الإضافية |</strong> Extra Bonus</span>
                  <span className="fine-price-value-tag green-txt">+600 EGP</span>
                </div>

                <div className="report-actions-row">
                  <button className="btn-report-action btn-orange-solid" onClick={() => navigate('/level2')}>
                    Next Level
                  </button>
                  <button className="btn-report-action btn-grey-dark" onClick={() => navigate('/menu')}>
                    Back Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER CARD MODAL */}
        {gameState === 'OVER' && (
          <div className="game-alert-dimmer blur-backdrop">
            <div className="score-report-card border-red-accent">
              <div className="report-card-body">
                <h1 className="report-headline-main red-txt">GAME OVER</h1>
                <h3 className="report-headline-arabic">غرامة فورية</h3>
                <span className="report-sub-title">Vehicle Damage Report</span>
                
                <hr className="report-divider-line" />
                
                <div className="report-metrics-list">
                  <div className="metric-item-row">
                    <div className="metric-badge-num bg-red-badge">1</div>
                    <div className="metric-details-text">
                      <strong className="metric-title-en">CRITICAL VEHICLE DAMAGE</strong>
                      <span className="metric-title-ar">الميكروباص تعرض لأضرار جسيمة</span>
                    </div>
                  </div>
                  <div className="metric-item-row">
                    <div className="metric-badge-num bg-red-badge">2</div>
                    <div className="metric-details-text">
                      <strong className="metric-title-en">RADAR SPEED VIOLATION</strong>
                      <span className="metric-title-ar">مخالفة تجاوز السرعة المقررة</span>
                    </div>
                  </div>
                </div>

                <div className="fine-total-container-box penalty-bg">
                  <span className="fine-label-mix"><strong>الغرامة المستحقة |</strong> Total Fine Applied</span>
                  <span className="fine-price-value-tag red-txt">-250 EGP</span>
                </div>

                <div className="report-actions-row">
                  <button className="btn-report-action btn-red-solid" onClick={handleRestartLevel}>
                    Try Again
                  </button>
                  <button className="btn-report-action btn-grey-dark" onClick={() => navigate('/menu')}>
                    Back Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAUSE CONTROL DIALOG MODAL */}
        {gameState === 'PAUSED' && (
          <div className="game-alert-dimmer blur-backdrop">
            <div className="pause-dialog-card">
              <div className="pause-card-header">
                <h2>PAUSED</h2>
                <button className="close-x-btn" onClick={handleResumeGame}>&times;</button>
              </div>
              <div className="pause-card-body">
                <button className="action-resume-btn" onClick={handleResumeGame}>
                  <span className="play-triangle-symbol">&#9658;</span> Resume
                </button>
                <button className="action-exit-btn" onClick={() => navigate('/menu')}>
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Intermediate Crash Recovery State Card */}
        {gameState === 'CRASHED' && lives > 0 && (
          <div className="game-alert-dimmer">
            <div className="alert-content-card border-orange">
              <h1 className="arabic-headline orange-txt">حادث!</h1>
              <p className="desc-txt">You hit a concrete barrier block! Keep eyes open.</p>
              <button className="alert-cta-btn bg-orange" onClick={() => { lastTimeRef.current = undefined; setGameState('PLAYING'); }}>
                Resume Route
              </button>
            </div>
          </div>
        )}
      </GameLayout>
    </div>
  );
}