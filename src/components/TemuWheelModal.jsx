import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSpinSound, playJackpotSound, playClickSound, playErrorSound, playCoinSound } from '../utils/sound';
import { Sparkles, Trophy, Gift, Zap, X, Coins } from 'lucide-react';

// 6 Sectors with Bet Outcome Multipliers
const WHEEL_SECTORS = [
  { id: 'same', label: '1배 (본전)', multiplier: 1, type: 'same', color: '#00CCFF', icon: '🪙', weight: 20 },
  { id: 'double', label: '2배 대박!', multiplier: 2, type: 'double', color: '#FFCC00', icon: '⚡', weight: 5 },
  { id: 'lose1', label: '꽝! (소멸)', multiplier: 0, type: 'lose', color: '#FF3366', icon: '💸', weight: 19 },
  { id: 'lose2', label: '꽝! (소멸)', multiplier: 0, type: 'lose', color: '#9933FF', icon: '💸', weight: 19 },
  { id: 'lose3', label: '꽝! (소멸)', multiplier: 0, type: 'lose', color: '#FF6600', icon: '💸', weight: 19 },
  { id: 'lose4', label: '꽝! (소멸)', multiplier: 0, type: 'lose', color: '#666699', icon: '💸', weight: 18 },
];

export const TemuWheelModal = ({ isOpen, onClose, userPoints, onSpinComplete }) => {
  const [selectedBet, setSelectedBet] = useState(5); // Default 5 Dallar bet
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const soundIntervalRef = useRef(null);

  // Reset modal state whenever isOpen changes
  useEffect(() => {
    setSpinning(false);
    setWonPrize(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const betOptions = [5, 6, 7, 8, 9, 10];

  const handleClose = () => {
    playClickSound();
    setSpinning(false);
    setWonPrize(null);
    onClose();
  };

  // Weighted Random Selector (Double reward probability = 5%)
  const getWeightedSectorIndex = () => {
    const randomVal = Math.random() * 100;
    let sum = 0;
    for (let i = 0; i < WHEEL_SECTORS.length; i++) {
      sum += WHEEL_SECTORS[i].weight;
      if (randomVal <= sum) return i;
    }
    return 0;
  };

  const handleSpin = () => {
    if (spinning) return;
    if (userPoints < selectedBet) {
      alert(`보유 달란트가 부족합니다! (필요: ${selectedBet}D, 현재: ${userPoints}D)`);
      return;
    }

    playClickSound();
    setSpinning(true);
    setWonPrize(null);

    // Weighted sector selection
    const selectedIndex = getWeightedSectorIndex();
    const sectorAngle = 360 / WHEEL_SECTORS.length;

    // Add extra rotations (5 ~ 8 full turns)
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = extraTurns + (360 - selectedIndex * sectorAngle - sectorAngle / 2);

    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    let speed = 80;
    const playSpinEffects = () => {
      playSpinSound();
    };
    soundIntervalRef.current = setInterval(playSpinEffects, speed);

    setTimeout(() => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      setSpinning(false);

      const prize = WHEEL_SECTORS[selectedIndex];
      setWonPrize(prize);

      if (prize.type === 'double') {
        playJackpotSound();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } else if (prize.type === 'same') {
        playCoinSound();
      } else {
        playErrorSound();
      }

      if (onSpinComplete) {
        const payout = selectedBet * prize.multiplier;
        onSpinComplete(selectedBet, payout, prize);
      }
    }, 3600);
  };

  return (
    <div className="modal-overlay">
      <div className="temu-wheel-card glow-temu">
        <button className="close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        {/* Temu Style Banner */}
        <div className="temu-header">
          <div className="temu-badge-flash pulse">⚡ 베팅 럭키 휠 ⚡</div>
          <h2 className="temu-title">DALAN BET SPIN</h2>
          <p className="temu-subtitle">5~10 달란트를 걸고 도전하세요! (2배 또는 꽝)</p>
        </div>

        {/* Bet Selection Selector */}
        <div className="bet-selector-section">
          <span className="bet-label"><Coins size={16} /> 베팅할 달란트 선택:</span>
          <div className="bet-chips">
            {betOptions.map((amount) => (
              <button
                key={amount}
                className={`bet-chip ${selectedBet === amount ? 'selected' : ''}`}
                disabled={spinning}
                onClick={() => { playClickSound(); setSelectedBet(amount); }}
              >
                {amount}D
              </button>
            ))}
          </div>
        </div>

        {/* Wheel Display Container */}
        <div className="wheel-wrapper">
          <div className="wheel-pointer">▼</div>

          <div
            className="wheel-disc"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3.6s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
          >
            {WHEEL_SECTORS.map((sector, index) => {
              const angle = (360 / WHEEL_SECTORS.length) * index;
              return (
                <div
                  key={index}
                  className="wheel-sector"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    backgroundColor: sector.color
                  }}
                >
                  <div className="sector-content">
                    <span className="sector-icon">{sector.icon}</span>
                    <span className="sector-text">{sector.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={`spin-trigger-btn ${spinning ? 'disabled' : ''}`}
            onClick={handleSpin}
            disabled={spinning}
          >
            {spinning ? '돌아가는 중!' : `${selectedBet}D SPIN`}
          </button>
        </div>

        {/* Won/Lose Outcome Banner */}
        {wonPrize && (
          <div className={`win-banner animate-bounce-in ${wonPrize.type}`}>
            <div className="win-icon">{wonPrize.icon}</div>
            <div className="win-info">
              {wonPrize.type === 'double' && (
                <>
                  <h3>🎉 대박! 2배 당첨! 🔥</h3>
                  <p className="win-detail">[{selectedBet * 2} 달란트]를 획득했습니다!</p>
                </>
              )}
              {wonPrize.type === 'same' && (
                <>
                  <h3>🪙 1배 (본전) 당첨!</h3>
                  <p className="win-detail">베팅한 [{selectedBet} 달란트]를 그대로 돌려받았습니다.</p>
                </>
              )}
              {wonPrize.type === 'lose' && (
                <>
                  <h3>💸 아쉽게도 꽝! (달란트 소멸)</h3>
                  <p className="win-detail">베팅한 [{selectedBet} 달란트]가 소멸되었습니다.</p>
                </>
              )}
            </div>
            <button className="claim-btn" onClick={handleClose}>
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
