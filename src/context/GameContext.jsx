import React, { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_wallet');
    return saved ? parseInt(saved, 10) : 1000; // Starts with 1000 EGP
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('mokhalfaty_levels');
    return saved ? JSON.parse(saved) : [1]; // Level 1 is unlocked by default
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

  useEffect(() => {
    localStorage.setItem('mokhalfaty_wallet', wallet);
    localStorage.setItem('mokhalfaty_levels', JSON.stringify(unlockedLevels));
    localStorage.setItem('mokhalfaty_plates', JSON.stringify(ownedPlates));
    localStorage.setItem('mokhalfaty_active_plate', activePlate);
    localStorage.setItem('mokhalfaty_upgrades', JSON.stringify(ownedUpgrades));
    localStorage.setItem('mokhalfaty_phrase', activePhrase);
  }, [wallet, unlockedLevels, ownedPlates, activePlate, ownedUpgrades, activePhrase]);

  
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
      wallet,
      unlockedLevels,
      ownedPlates,
      activePlate,
      ownedUpgrades,
      activePhrase,
      setOwnedPlates,
      setActivePlate,
      setOwnedUpgrades,
      setActivePhrase,
      earnMoney,
      chargeMoney,
      unlockNextLevel
    }}>
      {children}
    </GameContext.Provider>
  );
}