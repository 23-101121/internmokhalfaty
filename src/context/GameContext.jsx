import React, { createContext, useState, useEffect, useRef } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
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

  const bgMusicRef = useRef(null);

  useEffect(() => {
    bgMusicRef.current = new Audio();
    bgMusicRef.current.loop = true;
  }, []);

  useEffect(() => {
    localStorage.setItem('mokhalfaty_wallet', wallet);
    localStorage.setItem('mokhalfaty_levels', JSON.stringify(unlockedLevels));
    localStorage.setItem('mokhalfaty_plates', JSON.stringify(ownedPlates));
    localStorage.setItem('mokhalfaty_active_plate', activePlate);
    localStorage.setItem('mokhalfaty_upgrades', JSON.stringify(ownedUpgrades));
    localStorage.setItem('mokhalfaty_phrase', activePhrase);
    localStorage.setItem('mokhalfaty_music_muted', JSON.stringify(musicMuted));
    localStorage.setItem('mokhalfaty_sound_muted', JSON.stringify(soundMuted));
  }, [wallet, unlockedLevels, ownedPlates, activePlate, ownedUpgrades, activePhrase, musicMuted, soundMuted]);

  const playMusicTrack = (trackPath) => {
    if (!bgMusicRef.current) return;
    try {
      // Safe check handling both relative URLs and bundled asset hashes
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

  return (
    <GameContext.Provider value={{
      wallet, unlockedLevels, ownedPlates, activePlate, ownedUpgrades, activePhrase, musicMuted, soundMuted,
      setOwnedPlates, setActivePlate, setOwnedUpgrades, setActivePhrase, setMusicMuted, setSoundMuted,
      earnMoney, chargeMoney, unlockNextLevel, playMusicTrack, playSoundEffect
    }}>
      {children}
    </GameContext.Provider>
  );
}