import React, { useState } from 'react';
import { playClickSound, playCoinSound, toggleSound, isSoundEnabled } from '../utils/sound';
import { getTeacherItems, getPurchaseHistory } from '../utils/storage';
import { Camera, Volume2, VolumeX, Sparkles, Gift, Trophy, ShoppingBag, History, Award, User, Coins, QrCode } from 'lucide-react';

export const StudentView = ({
  student,
  onOpenScanner,
  onOpenWheel,
  onLogout
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
            <h2 className="student-name">
              {student.name} <small style={{ fontSize: '0.75rem', color: '#AAA' }}>({student.id || 'student01'})</small>
            </h2>
            <span className="student-sub">2026 Summer School Student</span>
          </div>
        </div>

        <div className="top-actions">
          <button className="icon-action-btn" onClick={handleToggleAudio} title="음향 효과">
            {soundOn ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} className="text-gray" />}
          </button>
          <button
            className="icon-action-btn"
            onClick={() => { playClickSound(); onLogout(); }}
            title="처음 화면(로그인)으로 이동"
            style={{ width: 'auto', padding: '0 10px', fontSize: '0.75rem', fontWeight: '800' }}
          >
            🚪 처음으로
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card (Temu Gold Theme) */}
      <div className="wallet-hero-card glow-temu">
        <div className="wallet-header">
          <span>MY STAMP WALLET</span>
          <span className="pulse-dot">● LIVE</span>
        </div>

        <div className="balance-display">
          <span className="coin-emoji animate-bounce-slow">🪙</span>
          <h1 className="balance-amount">{student.points}</h1>
          <span className="currency-unit">STAMP</span>
        </div>

        {/* Quick Game Event Buttons */}
        <div className="event-buttons-row" style={{ gridTemplateColumns: '1fr' }}>
          <button
            className={`event-btn temu-wheel-btn ${student.spinsLeft > 0 ? 'pulse' : ''}`}
            style={{ width: '100%', padding: '16px', justifyContent: 'center' }}
            onClick={() => {
              if ((student.spinsLeft || 0) <= 0) {
                alert('🔒 선생님의 [룰렛 1회 승인 QR]을 스캔하거나 선생님께 룰렛 승인을 받으세요!');
                onOpenScanner();
                return;
              }
              playClickSound();
              onOpenWheel();
            }}
          >
            <span className="event-icon" style={{ fontSize: '28px' }}>🎡</span>
            <div className="event-text">
              <strong style={{ fontSize: '1rem' }}>100% 당첨 룰렛 이벤트</strong>
              <span className="badge-count" style={{ fontSize: '0.8rem' }}>
                {student.spinsLeft > 0 ? `승인됨: ${student.spinsLeft}회 도전 가능` : '🔒 선생님 승인 필요'}
              </span>
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
          <small>카메라로 물품 QR 또는 스탬프 QR을 스캔하세요!</small>
        </button>
      </div>

      {/* Bible Verses Section */}
      <div className="bible-verses-section" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          className="bible-card glow-subtle"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(20, 20, 30, 0.85))',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            lineHeight: '1.7',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--temu-yellow)', fontWeight: '900', fontSize: '1.05rem' }}>
            <span>📖</span>
            <span>마태복음 13:44</span>
          </div>
          <p style={{ fontSize: '1rem', fontWeight: '600', wordBreak: 'keep-all', color: '#F8F9FA', margin: 0 }}>
            "천국은 마치 밭에 감추인 보화와 같으니 사람이 이를 발견한 후 숨겨 두고 기뻐하여 돌아가서 자기의 소유를 다 팔아 그 밭을 샀느니라"
          </p>
        </div>

        <div
          className="bible-card glow-subtle"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 199, 0, 0.12), rgba(30, 20, 40, 0.85))',
            border: '2px solid rgba(255, 199, 0, 0.5)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            lineHeight: '1.7',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--temu-yellow)', fontWeight: '900', fontSize: '1.05rem' }}>
            <span>📖</span>
            <span>마태복음 25:20-21</span>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', wordBreak: 'keep-all', color: '#F8F9FA', margin: 0 }}>
            "다섯 달란트 받았던 자는 다섯 달란트를 더 가지고 와서 가로되 주여 내게 다섯 달란트를 주셨는데 보소서 내가 또 다섯 달란트를 남겼나이다. 그 주인이 이르되 잘 하였도다 착하고 충성된 종아 네가 작은 일에 충성하였으매 내가 많은 것으로 네게 맡기리니 네 주인의 즐거움에 참예할찌어다."
          </p>
        </div>
      </div>
    </div>
  );
};
