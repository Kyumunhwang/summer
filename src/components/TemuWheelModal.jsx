import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSpinSound, playJackpotSound, playFanfareSound, playSadSound, playClickSound } from '../utils/sound';
import { Sparkles, Trophy, Gift, Zap, X } from 'lucide-react';

// 10 Sectors: 10 STAMP (1), 5 STAMP (1), 1 STAMP (2), 0 STAMP/꽝 (6)
const WHEEL_SECTORS = [
  { label: '10 STAMP', value: 10, type: 'win', color: '#9933FF', icon: '👑' }, // 10S (1개)
  { label: '아쉬워요! (0S)', value: 0, type: 'lose', color: '#3A3952', icon: '😭' }, // 꽝 1
  { label: '1 STAMP', value: 1, type: 'win', color: '#FF9900', icon: '🪙' },  // 1S (1개)
  { label: '다음 기회에 (0S)', value: 0, type: 'lose', color: '#2B2A3E', icon: '💨' }, // 꽝 2
  { label: '5 STAMP', value: 5, type: 'win', color: '#FF3366', icon: '💎' },  // 5S (1개)
  { label: '꽝! (0S)', value: 0, type: 'lose', color: '#3A3952', icon: '😅' }, // 꽝 3
  { label: '1 STAMP', value: 1, type: 'win', color: '#33CC66', icon: '✨' },  // 1S (2개째)
  { label: '아쉬워요! (0S)', value: 0, type: 'lose', color: '#2B2A3E', icon: '💔' }, // 꽝 4
  { label: '다음 기회에 (0S)', value: 0, type: 'lose', color: '#3A3952', icon: '🙈' }, // 꽝 5
  { label: '꽝! (0S)', value: 0, type: 'lose', color: '#2B2A3E', icon: '💦' }, // 꽝 6
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

    // Random sector selection (0~9)
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

      if (prize.value > 0) {
        // WIN outcome: Happy sound & Fireworks
        if (prize.value >= 10) {
          playJackpotSound();
        } else {
          playFanfareSound();
        }
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 }
        });
      } else {
        // LOSE outcome: Sad Bummer Sound
        playSadSound();
      }

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
          <div className="temu-badge-flash pulse">⚡ 행운의 룰렛 이벤트</div>
          <h2 className="temu-title">STAMP LUCKY WHEEL</h2>
          <p className="temu-subtitle">룰렛을 돌리고 행운의 스탬프를 받으세요!</p>
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

        {/* Won/Lost Result Banner */}
        {wonPrize && (
          <div className={`win-banner animate-bounce-in ${wonPrize.value === 0 ? 'lose-banner' : ''}`}>
            <div className="win-icon" style={{ fontSize: '36px' }}>{wonPrize.icon}</div>
            <div className="win-info">
              {wonPrize.value > 0 ? (
                <>
                  <h3 style={{ color: 'var(--temu-yellow)' }}>🎉 축하합니다! 🔥</h3>
                  <p className="win-detail">
                    <strong>+{wonPrize.value} 스탬프</strong> 당첨! 지갑에 추가되었습니다.
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ color: '#FF6666' }}>😭 아쉬워요! (꽝)</h3>
                  <p className="win-detail">
                    아쉽지만 다음 기회에 도전해 보세요!
                  </p>
                </>
              )}
            </div>
            <button
              className="claim-btn"
              onClick={() => {
                playClickSound();
                onClose();
              }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
