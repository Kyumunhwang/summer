import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playClickSound, playFanfareSound, playCoinSound } from '../utils/sound';
import { Gift, Sparkles, X, Trophy } from 'lucide-react';

const REWARDS = [
  { label: '5 달란트', points: 5, icon: '🪙' },
  { label: '15 달란트', points: 15, icon: '💰' },
  { label: '30 달란트 대박!', points: 30, icon: '🔥' },
  { label: '50 달란트 잭팟!', points: 50, icon: '👑' },
];

export const LuckyBoxModal = ({ isOpen, onClose, userPoints, onOpenBox }) => {
  const [opening, setOpening] = useState(false);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setOpenedIndex(null);
      setReward(null);
      setOpening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    playClickSound();
    setOpenedIndex(null);
    setReward(null);
    setOpening(false);
    onClose();
  };

  const handleSelectBox = (index) => {
    if (opening || openedIndex !== null) return;

    playClickSound();
    setOpening(true);
    setOpenedIndex(index);

    // Random reward calculation
    setTimeout(() => {
      const selectedReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      setReward(selectedReward);
      setOpening(false);

      if (selectedReward.points >= 30) {
        playFanfareSound();
      } else {
        playCoinSound();
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onOpenBox) {
        onOpenBox(selectedReward.points);
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="lucky-box-card glow-gold">
        <button className="close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="temu-header">
          <div className="temu-badge-flash">🎁 100% 당첨 럭키 상자</div>
          <h2>LUCKY GACHA BOX</h2>
          <p>상자 하나를 골라 터치해보세요! 100% 보너스 당첨!</p>
        </div>

        <div className="boxes-grid">
          {[0, 1, 2].map((idx) => {
            const isThisOpened = openedIndex === idx;
            return (
              <div
                key={idx}
                className={`gacha-box ${opening && isThisOpened ? 'box-shake' : ''} ${isThisOpened && reward ? 'opened' : ''}`}
                onClick={() => handleSelectBox(idx)}
              >
                {isThisOpened && reward ? (
                  <div className="opened-reward animate-pop">
                    <span className="reward-icon">{reward.icon}</span>
                    <span className="reward-label">{reward.label}</span>
                  </div>
                ) : (
                  <div className="unopened-box">
                    <span className="box-icon">📦</span>
                    <span className="box-tag">TAP!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {reward && (
          <div className="win-banner animate-bounce-in">
            <p>🎉 축하합니다! <strong>+{reward.points} 달란트</strong>를 얻었습니다!</p>
            <button className="claim-btn" onClick={handleClose}>
              내 지갑에 넣기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
