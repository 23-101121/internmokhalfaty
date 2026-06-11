import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

import GameLayout from '../components/GameLayout';
import Road from '../components/Road';
import PlayerBus from '../components/PlayerBus';
import Kameen from '../components/Kameen';

// Assets
import assetCameraImg from '../assets/asset_camera.png';
import flashSfx from '../assets/flash.mp3'; 
import imgWalletIcon from '../assets/icon_bag.png'; 

import './Level2.css';

const SPEED_LIMITS = [60, 80, 100];

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
      setCount(Math.floor(progress * (targetValue - startValue) + startValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, startValue, duration]);

  return <>{count} EGP</>;
}

export default function Level2() {
  const navigate = useNavigate();
  
  const { 
    wallet,
    unlockNextLevel, 
    earnMoney, 
    saveLevelStars,
    playSoundEffect 
  } = useContext(GameContext);

  const [gameState, setGameState] = useState('PLAYING');
  const [busLane, setBusLane] = useState(1); 
  const [currentSpeed, setCurrentSpeed] = useState(70); 
  const [speedLimit, setSpeedLimit] = useState(80); 
  const [distanceRemaining, setDistanceRemaining] = useState(1500); 
  const [violations, setViolations] = useState(0);
  const maxViolations = 3;

  const [cameras, setCameras] = useState([]);
  const [roadSigns, setRoadSigns] = useState([]); 
  const [triggerRadarFlash, setTriggerRadarFlash] = useState(false);

  const animationFrameRef = useRef();
  const lastTimeRef = useRef();
  const itemIdCounter = useRef(0);
  const cameraSpawnTimer = useRef(0);
  const signSpawnTimer = useRef(0);
  const speedLimitChangeTimer = useRef(0);

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
      if (e.key === 'ArrowUp') setCurrentSpeed((prev) => Math.min(140, prev + 5));
      if (e.key === 'ArrowDown') setCurrentSpeed((prev) => Math.max(40, prev - 5));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'ARRIVED') {
      const finishTimer = setTimeout(() => {
        setGameState('WON');
        earnMoney(800); 
        unlockNextLevel(3); 

        let starsEarned = 1;
        if (violations === 0) starsEarned = 3;
        else if (violations === 1) starsEarned = 2;

        saveLevelStars(2, starsEarned); 
      }, 2000);
      return () => clearTimeout(finishTimer);
    }
  }, [gameState, violations, earnMoney, unlockNextLevel, saveLevelStars]);

  useEffect(() => {
    const runGameTick = (timestamp) => {
      if (lastTimeRef.current === undefined) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (gameState === 'PLAYING') {
        setDistanceRemaining((prevDist) => {
          const metersTraveled = (currentSpeed * 1000 / 3600) * deltaTime * 1.8;
          const nextDist = prevDist - metersTraveled;
          if (nextDist <= 0) {
            setGameState('ARRIVED');
            return 0;
          }
          return nextDist;
        });

        speedLimitChangeTimer.current += deltaTime;
        if (speedLimitChangeTimer.current >= 6) {
          speedLimitChangeTimer.current = 0;
          const filteredLimits = SPEED_LIMITS.filter(lim => lim !== speedLimit);
          const nextLimit = filteredLimits[Math.floor(Math.random() * filteredLimits.length)];
          setSpeedLimit(nextLimit);
          
          setRoadSigns((prev) => [...prev, { id: itemIdCounter.current++, value: nextLimit, y: -120 }]);
        }

        // Camera Spawn Generator Loop
        cameraSpawnTimer.current += deltaTime;
        const camInterval = Math.max(2.5, 6.0 - (currentSpeed / 25));
        if (cameraSpawnTimer.current >= camInterval && distanceRemaining > 150) {
          cameraSpawnTimer.current = 0;
          setCameras((prev) => [...prev, { id: itemIdCounter.current++, y: -150, hasChecked: false }]);
        }

        // On-Road Asphalt Limit Signs Spawn Generator
        signSpawnTimer.current += deltaTime;
        if (signSpawnTimer.current >= 4.5 && distanceRemaining > 200) {
          signSpawnTimer.current = 0;
          setRoadSigns((prev) => [...prev, { id: itemIdCounter.current++, value: speedLimit, y: -120 }]);
        }

        const currentFrameVelocity = currentSpeed * 6.5;

        // Animate Camera Radar Units
        setCameras((prevList) =>
          prevList
            .map((cam) => {
              const downwardMovement = cam.y + (deltaTime * currentFrameVelocity);
              const viewportHeight = window.innerHeight || 750;
              const radarLine = viewportHeight - 240; // Adjusted for larger bounding height context

              if (downwardMovement >= radarLine && !cam.hasChecked) {
                cam.hasChecked = true;
                if (currentSpeed > speedLimit) {
                  processRadarInfraction();
                }
              }
              return { ...cam, y: downwardMovement };
            })
            .filter((cam) => cam.y < (window.innerHeight || 750) + 200)
        );

        // Animate Ground Signs
        setRoadSigns((prevSigns) => 
          prevSigns
            .map((sign) => ({ ...sign, y: sign.y + (deltaTime * currentFrameVelocity) }))
            .filter((sign) => sign.y < (window.innerHeight || 750) + 150)
        );
      }

      animationFrameRef.current = requestAnimationFrame(runGameTick);
    };

    animationFrameRef.current = requestAnimationFrame(runGameTick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, currentSpeed, speedLimit, distanceRemaining]);

  const processRadarInfraction = () => {
    playSoundEffect(flashSfx);
    setTriggerRadarFlash(true);
    setTimeout(() => setTriggerRadarFlash(false), 250);

    setViolations((prevCount) => {
      const totalViolations = prevCount + 1;
      if (totalViolations >= maxViolations) {
        setGameState('OVER');
        earnMoney(-300); 
      }
      return totalViolations;
    });
  };

  const handleRestartLevel = () => {
    lastTimeRef.current = undefined;
    setDistanceRemaining(1500);
    setViolations(0);
    setCurrentSpeed(70);
    setCameras([]);
    setRoadSigns([]);
    setGameState('PLAYING');
  };

  return (
    <div className={`level2-game-canvas ${triggerRadarFlash ? 'level2-flash-active' : ''}`}>
      
      {/* SCREEN FLASH ANIMATION BLOCK */}
      {triggerRadarFlash && <div className="level2-screen-flash-element" />}

      <GameLayout hud={null} progressBar={null}>
        
        {/* RIGHT TOP ACTION MENU TRIGGER BUTTON */}
        {gameState === 'PLAYING' && (
          <button className="level2-hud-pause-btn" onClick={() => setGameState('PAUSED')}>
            <div className="level2-pause-bars">
              <span /><span />
            </div>
          </button>
        )}

        {/* TOP WALLET BALANCE CONTAINER */}
        {(gameState === 'WON' || gameState === 'OVER') && (
          <div className={`level2-top-wallet-positioner ${gameState === 'WON' ? 'level2-wallet-win' : 'level2-wallet-loss'}`}>
            <div className="level2-plates-wallet-badge">
              <img src={imgWalletIcon} alt="Wallet Bag" className="level2-wallet-badge-icon" />
              <span className="level2-wallet-badge-value">
                <AnimatedWalletCounter 
                  targetValue={wallet} 
                  changeAmount={gameState === 'OVER' ? 300 : 800} 
                  isLoss={gameState === 'OVER'} 
                />
              </span>
            </div>
          </div>
        )}

        {/* HEADS-UP PERFORMANCE INTERFACES */}
        {gameState !== 'ARRIVED' && gameState !== 'WON' && gameState !== 'OVER' && (
          <>
            {/* BOX 1: SEPARATED DECOUPLED LEFT PANEL CONTAINER */}
            <div className="level2-violations-left-box level2-ui-theme-frame">
              <span className="level2-metric-label">📋 LICENSE STATUS</span>
              <div className="level2-metric-value level2-text-red">
                <span>Violations: {violations} / {maxViolations}</span>
              </div>
            </div>

            {/* BOX 2: PRECISELY VIEWPORT-CENTERED MAIN METRIC SCOREBOARD */}
            <div className="level2-hud-dashboard-centered dark-blue-accent-bg level2-ui-theme-frame">
              <div className="level2-metric-column">
                <span className="level2-metric-label">📍 CHECKPOINT DISTANCE</span>
                <span className="level2-metric-value level2-text-gold">Destination: {Math.floor(distanceRemaining)}m</span>
              </div>
              
              <div className="level2-metric-column level2-divider-left">
                <span className="level2-metric-label">⚡ SPEED INDICATOR</span>
                <span className={`level2-metric-value ${currentSpeed > speedLimit ? 'level2-speed-alert' : 'level2-text-green'}`}>
                  Speed: {currentSpeed} km/h
                </span>
              </div>
            </div>
          </>
        )}

        <Road 
          scrollingPaused={gameState === 'PAUSED' || gameState === 'ARRIVED' || gameState === 'WON' || gameState === 'OVER'}
          speedModifier={currentSpeed / 75}
        >
          {/* SPEED LIMIT SIGN STAMPED DIRECTLY ON GROUND OF ROAD */}
          {roadSigns.map((sign) => (
            <div 
              key={sign.id} 
              className="level2-ground-speed-sign"
              style={{ transform: `translateY(${sign.y}px) translateX(-50%)` }}
            >
              <div className="level2-ground-circle-border">
                <span className="level2-ground-sign-number">{sign.value}</span>
              </div>
            </div>
          ))}

          {/* LEFT-SIDE PINNED MAGNIFIED SPEED RADAR CAMERAS */}
          {cameras.map((cam) => (
            <img
              key={cam.id}
              src={assetCameraImg}
              alt="Magnified Left Radar Cam"
              className="level2-radar-ground-asset level2-pos-left-lane"
              style={{ transform: `translateY(${cam.y}px)` }}
            />
          ))}

          <PlayerBus lane={busLane} />
          <Kameen visible={gameState === 'ARRIVED' || gameState === 'WON'} />
        </Road>

        {/* WIN PANEL COMPONENT REPLICA */}
        {gameState === 'WON' && (
          <div className="level2-dimmer-overlay level2-blur-backdrop">
            <div className="level2-card-ticket level2-border-green">
              <div className="level2-ticket-wrapper">
                <h1 className="level2-headline-main level2-green-txt">Sawaq Mohtaram!</h1>
                <h3 className="level2-headline-arabic">سواق محترم مية مية</h3>
                <span className="level2-ticket-sub">Radar Route Cleared</span>
                
                <hr className="level2-ticket-hr" />
                
                <p className="level2-narrative-p">
                  لقد تمكنت من مراوغة الرادارات والالتزام بالسرعة دون سحب رخصتك!
                </p>

                <div className="level2-cash-status-box level2-bg-bonus">
                  <span className="level2-cash-label"><strong>مكافأة إضافية |</strong> Level Clear Bonus</span>
                  <span className="level2-cash-value level2-green-txt">+800 EGP</span>
                </div>

                <div className="level2-actions-grid">
                  <button className="level2-btn-cta level2-btn-orange" onClick={() => navigate('/level3')}>
                    Next Level
                  </button>
                  <button className="level2-btn-cta level2-btn-grey" onClick={() => navigate('/menu')}>
                    Back Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOSE PANEL COMPONENT REPLICA */}
        {gameState === 'OVER' && (
          <div className="level2-dimmer-overlay level2-blur-backdrop">
            <div className="level2-card-ticket level2-border-red">
              <div className="level2-ticket-wrapper">
                <h1 className="level2-headline-main level2-red-txt">ROUTE FAILED</h1>
                <h3 className="level2-headline-arabic">الرخصة اتسحبت يا اسطى</h3>
                <span className="level2-ticket-sub">Violations Limit Exceeded</span>
                
                <hr className="level2-ticket-hr" />
                
                <p className="level2-narrative-p">
                  تجاوزت الحد الأقصى للمخالفات المرورية المسموح بها على هذا الطريق.
                </p>

                <div className="level2-cash-status-box level2-bg-penalty">
                  <span className="level2-cash-label"><strong>الغرامة المستحقة |</strong> Total Ticket Cost</span>
                  <span className="level2-cash-value level2-red-txt">-300 EGP</span>
                </div>

                <div className="level2-actions-grid">
                  <button className="level2-btn-cta level2-btn-red-solid" onClick={handleRestartLevel}>
                    Try Again
                  </button>
                  <button className="level2-btn-cta level2-btn-grey" onClick={() => navigate('/menu')}>
                    Back Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRIP HALT PAUSE SYSTEM INTERACTION */}
        {gameState === 'PAUSED' && (
          <div className="level2-dimmer-overlay level2-blur-backdrop">
            <div className="level2-pause-modal">
              <div className="level2-pause-header">
                <h2>ROUTE PAUSED</h2>
                <button className="level2-close-x" onClick={() => { lastTimeRef.current = undefined; setGameState('PLAYING'); }}>&times;</button>
              </div>
              <div className="level2-pause-body">
                <button className="level2-btn-resume" onClick={() => { lastTimeRef.current = undefined; setGameState('PLAYING'); }}>
                  <span>&#9658;</span> Resume Trip
                </button>
                <button className="level2-btn-exit" onClick={() => navigate('/menu')}>
                  Exit Level
                </button>
              </div>
            </div>
          </div>
        )}

      </GameLayout>
    </div>
  );
}