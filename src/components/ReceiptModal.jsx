import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playFanfareSound, playErrorSound, playClickSound } from '../utils/sound';
import { ShoppingBag, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, item, studentPoints, onConfirmPurchase }) => {
  const [purchased, setPurchased] = useState(false);

  if (!isOpen || !item) return null;

  const canAfford = studentPoints >= item.price;
  const remainingAfter = studentPoints - item.price;

  const handlePurchase = () => {
    if (!canAfford) {
      playErrorSound();
      return;
    }

    playClickSound();
    setPurchased(true);

    // Fanfare and Fireworks
    playFanfareSound();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });

    if (onConfirmPurchase) {
      onConfirmPurchase(item);
    }
  };

  const handleCloseAll = () => {
    setPurchased(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="receipt-card glow-temu animate-pop">
        <button className="close-btn" onClick={handleCloseAll}>
          <X size={24} />
        </button>

        {!purchased ? (
          /* Payment Confirmation View */
          <div className="checkout-confirm-box">
            <div className="temu-badge-flash">🛒 구매 확인</div>
            <div className="item-hero-icon">{item.icon || '🎁'}</div>
            <h2 className="item-title">{item.name}</h2>
            <p className="item-desc">{item.description}</p>

            <div className="price-tag-big">
              <span>필요 달란트:</span>
              <strong className="gold-text">{item.price} DALLAR</strong>
            </div>

            <div className="balance-calc-box">
              <div className="calc-row">
                <span>현재 보유 달란트:</span>
                <span>{studentPoints} D</span>
              </div>
              <div className="calc-row">
                <span>차감 달란트:</span>
                <span className="text-red">-{item.price} D</span>
              </div>
              <div className="calc-row total">
                <span>구매 후 잔액:</span>
                <span className={canAfford ? 'text-green' : 'text-red'}>
                  {remainingAfter} D
                </span>
              </div>
            </div>

            {!canAfford && (
              <div className="warning-banner">
                <AlertTriangle size={18} />
                <span>달란트가 부족합니다! (부족: {Math.abs(remainingAfter)} D)</span>
              </div>
            )}

            <button
              className={`temu-action-btn ${!canAfford ? 'disabled' : ''}`}
              onClick={handlePurchase}
              disabled={!canAfford}
            >
              {canAfford ? '🎉 팡팡! 즉시 구매하기' : '달란트 부족'}
            </button>
          </div>
        ) : (
          /* Purchased Receipt View */
          <div className="digital-receipt-box animate-bounce-in">
            <div className="success-badge">
              <CheckCircle size={40} className="check-icon animate-pulse" />
              <h2>구매 완료! SUCCESS!</h2>
              <p>선생님께 영수증을 보여주시고 물품을 수령하세요!</p>
            </div>

            <div className="receipt-paper">
              <div className="receipt-header">
                <h3>📜 DALLAR MARKET RECEIPT</h3>
                <span className="order-id">NO. #{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>

              <div className="receipt-body">
                <div className="receipt-item-info">
                  <span className="r-icon">{item.icon}</span>
                  <div>
                    <h4>{item.name}</h4>
                    <span className="r-qty">수량: 1개</span>
                  </div>
                  <span className="r-price">-{item.price} D</span>
                </div>

                <div className="receipt-divider">------------------------------</div>

                <div className="receipt-summary">
                  <div className="r-row">
                    <span>사용한 달란트:</span>
                    <strong>{item.price} D</strong>
                  </div>
                  <div className="r-row">
                    <span>남은 달란트:</span>
                    <strong className="gold-text">{remainingAfter} D</strong>
                  </div>
                </div>
              </div>

              <div className="receipt-footer">
                <p>2026 SUMMER SCHOOL FUNDAY</p>
                <p className="sub">Thank you for participating!</p>
              </div>
            </div>

            <button className="claim-btn" onClick={handleCloseAll}>
              확인 (완료)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
