import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSpinSound, playJackpotSound, playClickSound } from '../utils/sound';
import { Sparkles, Trophy, Gift, Zap, X } from 'lucide-react';

const WHEEL_SECTORS = [
  { label: '50 달란트', value: 50, type: 'points', color: '#FF3366', icon: '💰' },
  { label: '20 달란트', value: 20, type: 'points', color: '#FF9900', icon: '🪙' },
  { label: '100D 잭팟!', value: 100, type: 'jackpot', color: '#9933FF', icon: '👑' },
  { label: '10 달란트', value: 10, type: 'points', color: '#33CC66', icon: '✨' },
  { label: '2배 찬스!', value: 'DOUBLE', type: 'double', color: '#FFCC00', icon: '⚡' },
  { label: '럭키 럭키', value: 30, type: 'points', color: '#00CCFF', icon: '🎁' },
];

export const TemuWheelModal = ({ isOpen, onClose, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const soundIntervalRef = useRef(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    playClickSound();
    setSpinning(true);
    setWonPrize(null);

    // Random sector selection
    const selectedIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    
    // Add extra rotations (5 ~ 8 full turns)
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    // Calculate final angle to center the winning sector at top (pointer)
    const targetAngle = extraTurns + (360 - selectedIndex * sectorAngle - sectorAngle / 2);
    
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    // Play spinning click sound during rotation
    let speed = 80;
    const playSpinEffects = () => {
      playSpinSound();
    };
    soundIntervalRef.current = setInterval(playSpinEffects, speed);

    // Stop spin sound after transition (3.5s)
    setTimeout(() => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      setSpinning(false);

      const prize = WHEEL_SECTORS[selectedIndex];
      setWonPrize(prize);

      // Play Jackpot sound & explosion
      playJackpotSound();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });

      if (onWin) {
        onWin(prize);
      }
    }, 3600);
  };

  return (
    <div className="modal-overlay">
      <div className="temu-wheel-card glow-temu">
        <button className="close-btn" onClick={() => { playClickSound(); onClose(); }}>
          <X size={24} />
        </button>

        {/* Temu Style Banner */}
        <div className="temu-header">
          <div className="temu-badge-flash pulse">⚡ 100% 당첨 럭키 휠</div>
          <h2 className="temu-title">TEMU STYLE DALAN SPIN</h2>
          <p className="temu-subtitle">룰렛을 돌리고 초대박 혜택 달란트를 받으세요!</p>
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
            {spinning ? '돌아가는 중!' : 'SPIN!'}
          </button>
        </div>

        {/* Won Prize Popup Modal Banner */}
        {wonPrize && (
          <div className="win-banner animate-bounce-in">
            <div className="win-icon">{wonPrize.icon}</div>
            <div className="win-info">
              <h3>축하합니다! 🔥</h3>
              <p className="win-detail">
                [{wonPrize.label}] 당첨! 달란트 지갑에 즉시 지급되었습니다.
              </p>
            </div>
            <button
              className="claim-btn"
              onClick={() => {
                playClickSound();
                onClose();
              }}
            >
              확인 & 혜택 받기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
