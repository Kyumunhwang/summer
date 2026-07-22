import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playClickSound, playFanfareSound, playCoinSound, playErrorSound } from '../utils/sound';
import { Gift, Sparkles, X, Trophy, Coins } from 'lucide-react';

export const LuckyBoxModal = ({ isOpen, onClose, userPoints, onOpenBox }) => {
  const [selectedBet, setSelectedBet] = useState(5); // Default 5 Dallar bet
  const [opening, setOpening] = useState(false);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [outcome, setOutcome] = useState(null); // { isWin: boolean, payout: number }

  // Reset modal state every time it opens or closes
  useEffect(() => {
    setOpening(false);
    setOpenedIndex(null);
    setOutcome(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const betOptions = [5, 6, 7, 8, 9, 10];

  const handleClose = () => {
    playClickSound();
    setOpening(false);
    setOpenedIndex(null);
    setOutcome(null);
    onClose();
  };

  const handleSelectBox = (index) => {
    if (opening || openedIndex !== null) return;
    if (userPoints < selectedBet) {
      alert(`보유 달란트가 부족합니다! (필요: ${selectedBet}D, 현재: ${userPoints}D)`);
      return;
    }

    playClickSound();
    setOpening(true);
    setOpenedIndex(index);

    // 8% chance to pick the 2x box, 92% chance for 0D lose box
    const isWin = Math.random() < 0.08;
    const payout = isWin ? selectedBet * 2 : 0;

    setTimeout(() => {
      setOutcome({ isWin, payout });
      setOpening(false);

      if (isWin) {
        playFanfareSound();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        playErrorSound();
      }

      if (onOpenBox) {
        onOpenBox(selectedBet, payout);
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="lucky-box-card glow-gold">
        <button className="close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        {/* Header Banner */}
        <div className="temu-header">
          <div className="temu-badge-flash pulse">🎁 5~10D 베팅 럭키 박스</div>
          <h2>LUCKY GACHA BOX</h2>
          <p>상자 3개 중 1개는 2배 대박! 2개는 0달란트(소멸)</p>
        </div>

        {/* Bet Selection Selector */}
        <div className="bet-selector-section">
          <span className="bet-label"><Coins size={16} /> 베팅할 달란트 선택:</span>
          <div className="bet-chips">
            {betOptions.map((amount) => (
              <button
                key={amount}
                className={`bet-chip ${selectedBet === amount ? 'selected' : ''}`}
                disabled={opening || openedIndex !== null}
                onClick={() => { playClickSound(); setSelectedBet(amount); }}
              >
                {amount}D
              </button>
            ))}
          </div>
        </div>

        {/* 3 Gacha Boxes Grid */}
        <div className="boxes-grid">
          {[0, 1, 2].map((idx) => {
            const isThisOpened = openedIndex === idx;
            return (
              <div
                key={idx}
                className={`gacha-box ${opening && isThisOpened ? 'box-shake' : ''} ${isThisOpened && outcome ? 'opened' : ''}`}
                onClick={() => handleSelectBox(idx)}
              >
                {isThisOpened && outcome ? (
                  <div className="opened-reward animate-pop">
                    <span className="reward-icon">{outcome.isWin ? '👑' : '💸'}</span>
                    <span className="reward-label">
                      {outcome.isWin ? `2배 대박!\n(+${outcome.payout}D)` : '0달란트\n(소멸)'}
                    </span>
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

        {/* Won / Lose Result Banner */}
        {outcome && (
          <div className={`win-banner animate-bounce-in ${outcome.isWin ? 'double' : 'lose'}`}>
            {outcome.isWin ? (
              <>
                <p>🎉 2배 대박 당첨! <strong>+{outcome.payout} 달란트</strong>를 획득했습니다!</p>
                <button className="claim-btn" onClick={handleClose}>
                  지갑에 넣기
                </button>
              </>
            ) : (
              <>
                <p>💸 아쉽게도 0달란트(꽝)! 베팅한 <strong>{selectedBet} 달란트</strong>가 소멸되었습니다.</p>
                <button className="claim-btn" onClick={handleClose}>
                  확인
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
