import React, { createContext, useState, useEffect, useRef } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  // --- Pre-existing State Variables ---
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_wallet');
    return saved ? parseInt(saved, 10) : 1000;
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_levels');
    return saved ? JSON.parse(saved) : [1];
  });

  const [ownedPlates, setOwnedPlates] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_plates');
    return saved ? JSON.parse(saved) : ['default_plate'];
  });

  const [activePlate, setActivePlate] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_active_plate');
    return saved ? saved : 'default_plate';
  });

  const [ownedUpgrades, setOwnedUpgrades] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_upgrades');
    return saved ? JSON.parse(saved) : ['stock_engine'];
  });

  const [activePhrase, setActivePhrase] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_phrase');
    return saved ? saved : 'none';
  });

  const [musicMuted, setMusicMuted] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_music_muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [soundMuted, setSoundMuted] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_sound_muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [licenseHealth, setLicenseHealth] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_license_health');
    return saved ? parseInt(saved, 10) : 3; 
  });

  // --- NEW: Persistent Level Stars Object Tracker ---
  const [levelStars, setLevelStars] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_level_stars');
    return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  });

  const bgMusicRef = useRef(null);

  // Initialize Background Audio Engine
  useEffect(() => {
    bgMusicRef.current = new Audio();
    bgMusicRef.current.loop = true;
  }, []);

  // --- Synced Local Storage Sync Effect ---
  useEffect(() => {
    localStorage.setItem('mokhalfaty_wallet', wallet);
    localStorage.setItem('mokhalfaty_levels', JSON.stringify(unlockedLevels));
    localStorage.setItem('mokhalfaty_plates', JSON.stringify(ownedPlates));
    localStorage.setItem('mokhalfaty_active_plate', activePlate);
    localStorage.setItem('mokhalfaty_upgrades', JSON.stringify(ownedUpgrades));
    localStorage.setItem('mokhalfaty_phrase', activePhrase);
    localStorage.setItem('mokhalfaty_music_muted', JSON.stringify(musicMuted));
    localStorage.setItem('mokhalfaty_sound_muted', JSON.stringify(soundMuted));
    localStorage.setItem('mokhalfaty_license_health', licenseHealth);
    localStorage.setItem('mokhalfaty_level_stars', JSON.stringify(levelStars)); // Syncing Stars state
  }, [wallet, unlockedLevels, ownedPlates, activePlate, ownedUpgrades, activePhrase, musicMuted, soundMuted, licenseHealth, levelStars]);

  // --- Pre-existing Audio Player Implementations ---
  const playMusicTrack = (trackPath) => {
    if (!bgMusicRef.current) return;
    try {
      if (!bgMusicRef.current.src || !bgMusicRef.current.src.includes(trackPath)) {
        bgMusicRef.current.src = trackPath;
        bgMusicRef.current.load();
      }
      if (!musicMuted) {
        bgMusicRef.current.play().catch((err) => {
          console.warn("Background music blocked until first user interaction:", err.message);
        });
      }
    } catch (e) {
      console.error("Music playback error:", e);
    }
  };

  useEffect(() => {
    if (!bgMusicRef.current) return;
    if (musicMuted) {
      bgMusicRef.current.pause();
    } else if (bgMusicRef.current.src) {
      bgMusicRef.current.play().catch(() => {});
    }
  }, [musicMuted]);

  const playSoundEffect = (sfxPath) => {
    if (soundMuted || !sfxPath) return;
    try {
      const effectPlayer = new Audio(sfxPath);
      effectPlayer.volume = 0.85;
      
      const playPromise = effectPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Sound effect playback was prevented by browser autoplay policies:", err.message);
        });
      }
    } catch (e) {
      console.error("Sound effect exception:", e);
    }
  };

  // --- Core Action Dispatch Methods ---
  const earnMoney = (amount) => {
    setWallet((prev) => prev + amount);
  };

  const chargeMoney = (amount) => {
    if (wallet >= amount) {
      setWallet((prev) => prev - amount);
      return true; 
    }
    return false;
  };

  const unlockNextLevel = (levelNumber) => {
    if (!unlockedLevels.includes(levelNumber)) {
      setUnlockedLevels((prev) => [...prev, levelNumber]);
    }
  };

  // --- NEW: Save Earned Level Stars Function ---
  const saveLevelStars = (levelId, starsCount) => {
    setLevelStars((prevStars) => ({
      ...prevStars,
      [levelId]: Math.max(prevStars[levelId] || 0, starsCount) // Keeps highest score achieved
    }));
  };

  const looseLicensePoint = () => {
    setLicenseHealth((prev) => Math.max(0, prev - 1));
  };

  const resetEntireGameSession = () => {
    setWallet(1000);
    setUnlockedLevels([1]);
    setOwnedPlates(['default_plate']);
    setActivePlate('default_plate');
    setOwnedUpgrades(['stock_engine']);
    setActivePhrase('none');
    setLicenseHealth(3);
    setLevelStars({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });
  };

  return (
    <GameContext.Provider value={{
      wallet, unlockedLevels, ownedPlates, activePlate, ownedUpgrades, activePhrase, musicMuted, soundMuted, licenseHealth, levelStars,
      setOwnedPlates, setActivePlate, setOwnedUpgrades, setActivePhrase, setMusicMuted, setSoundMuted, setLicenseHealth,
      earnMoney, chargeMoney, unlockNextLevel, saveLevelStars, playMusicTrack, playSoundEffect, looseLicensePoint, resetEntireGameSession
    }}>
      {children}
    </GameContext.Provider>
  );
}