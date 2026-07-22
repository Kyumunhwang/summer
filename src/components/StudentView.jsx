import React, { useState } from 'react';
import { playClickSound, playCoinSound, toggleSound, isSoundEnabled } from '../utils/sound';
import { getTeacherItems, getPurchaseHistory } from '../utils/storage';
import { Camera, Volume2, VolumeX, Sparkles, Gift, Trophy, ShoppingBag, History, Award, User } from 'lucide-react';

export const StudentView = ({
  student,
  onOpenScanner,
  onOpenWheel,
  onOpenLuckyBox,
  onSelectItemToBuy,
  onSwitchToTeacher
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showHistory, setShowHistory] = useState(false);

  const items = getTeacherItems();
  const history = getPurchaseHistory();

  const handleToggleAudio = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playCoinSound();
  };

  return (
    <div className="student-container">
      {/* Top Banner Bar */}
      <div className="top-banner-bar">
        <div className="student-profile">
          <span className="avatar-badge">{student.avatar || '🦁'}</span>
          <div>
            <h2 className="student-name">{student.name}</h2>
            <span className="student-sub">2026 Summer School Student</span>
          </div>
        </div>

        <div className="top-actions">
          <button className="icon-action-btn" onClick={handleToggleAudio} title="음향 효과">
            {soundOn ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} className="text-gray" />}
          </button>
          <button
            className="icon-action-btn teacher-switch"
            onClick={() => { playClickSound(); onSwitchToTeacher(); }}
            title="선생님 모드"
          >
            <Award size={20} />
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card (Temu Gold Theme) */}
      <div className="wallet-hero-card glow-temu">
        <div className="wallet-header">
          <span>MY DALAN WALLET</span>
          <span className="pulse-dot">● LIVE</span>
        </div>

        <div className="balance-display">
          <span className="coin-emoji animate-bounce-slow">🪙</span>
          <h1 className="balance-amount">{student.points}</h1>
          <span className="currency-unit">DALLAR</span>
        </div>

        {/* Quick Game Event Buttons */}
        <div className="event-buttons-row">
          <button
            className={`event-btn temu-wheel-btn ${student.spinsLeft > 0 ? 'pulse' : ''}`}
            onClick={() => { playClickSound(); onOpenWheel(); }}
          >
            <span className="event-icon">🎡</span>
            <div className="event-text">
              <strong>100% 당첨 룰렛</strong>
              <span className="badge-count">티켓: {student.spinsLeft || 0}개</span>
            </div>
          </button>

          <button
            className="event-btn lucky-box-btn"
            onClick={() => { playClickSound(); onOpenLuckyBox(); }}
          >
            <span className="event-icon">🎁</span>
            <div className="event-text">
              <strong>럭키 뽑기 상자</strong>
              <span className="badge-count">2D 도전</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Camera QR Scan Action Button */}
      <div className="scan-trigger-section">
        <button
          className="giant-qr-scan-btn animate-pulse-subtle"
          onClick={() => { playClickSound(); onOpenScanner(); }}
        >
          <div className="btn-glow-ring"></div>
          <Camera size={32} />
          <span>선생님 QR 코드 스캔하기</span>
          <small>카메라로 물품 QR 또는 포인트 QR을 스캔하세요!</small>
        </button>
      </div>

      {/* Badges Bar */}
      <div className="badges-bar">
        <span className="badges-label">🎖️ 획득 뱃지:</span>
        <div className="badges-list">
          {student.badges.map((b, idx) => (
            <span key={idx} className="badge-pill">{b}</span>
          ))}
        </div>
      </div>

      {/* Market Items & History Toggle Tab */}
      <div className="market-section">
        <div className="section-tabs">
          <button
            className={`tab-btn ${!showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(false)}
          >
            <ShoppingBag size={18} /> Dallar Market 물품 ({items.length})
          </button>
          <button
            className={`tab-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(true)}
          >
            <History size={18} /> 내 구매 영수증 ({history.length})
          </button>
        </div>

        {!showHistory ? (
          /* Items Grid */
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card glow-subtle">
                <div className="item-badge">{item.badge || 'POPULAR'}</div>
                <div className="item-icon-wrapper">{item.icon}</div>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-desc">{item.description}</p>

                <div className="item-footer">
                  <span className="price-tag">{item.price} DALLAR</span>
                  <button
                    className="buy-btn"
                    onClick={() => { playClickSound(); onSelectItemToBuy(item); }}
                  >
                    구매
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Purchase History List */
          <div className="history-list">
            {history.length === 0 ? (
              <p className="empty-msg">아직 구매 내역이 없습니다. QR을 스캔해 물품을 사보세요!</p>
            ) : (
              history.map((rec, idx) => (
                <div key={idx} className="history-card">
                  <div className="h-icon">{rec.icon || '🛍️'}</div>
                  <div className="h-info">
                    <h4>{rec.name}</h4>
                    <span className="h-time">{rec.timestamp}</span>
                  </div>
                  <span className="h-price">-{rec.price} D</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
