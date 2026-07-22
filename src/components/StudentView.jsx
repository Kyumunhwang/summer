import React, { useState, useEffect } from 'react';
import { getTeacherItems, getPurchaseHistory } from '../utils/storage';
import { playClickSound } from '../utils/sound';
import { ShoppingBag, History, LogOut, Camera } from 'lucide-react';

export const StudentView = ({ student, onLogout, onOpenScanner, onOpenWheel, onOpenLuckyBox, gameConfig, onDataChange }) => {
  const [items, setItems] = useState(getTeacherItems());
  const [history, setHistory] = useState(getPurchaseHistory(student?.id));
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const handleItemsChanged = () => {
      setItems(getTeacherItems());
    };
    const handleHistoryChanged = () => {
      setHistory(getPurchaseHistory(student?.id));
    };
    const handleStorageChanged = () => {
      setItems(getTeacherItems());
      setHistory(getPurchaseHistory(student?.id));
    };

    setHistory(getPurchaseHistory(student?.id));

    window.addEventListener('dallarItemsChanged', handleItemsChanged);
    window.addEventListener('dallarHistoryChanged', handleHistoryChanged);
    window.addEventListener('storage', handleStorageChanged);
    return () => {
      window.removeEventListener('dallarItemsChanged', handleItemsChanged);
      window.removeEventListener('dallarHistoryChanged', handleHistoryChanged);
      window.removeEventListener('storage', handleStorageChanged);
    };
  }, [student]);


  const wheelSpinsLeft = student?.spinsLeft !== undefined ? student.spinsLeft : 1;
  const luckyBoxSpinsLeft = student?.luckyBoxSpinsLeft !== undefined ? student.luckyBoxSpinsLeft : 1;

  const isWheelPlayable = gameConfig.isWheelEnabled && wheelSpinsLeft > 0;
  const isLuckyBoxPlayable = gameConfig.isLuckyBoxEnabled && luckyBoxSpinsLeft > 0;

  return (
    <div className="student-container">
      {/* Top Profile Header Bar */}
      <div className="student-header">
        <div className="profile-info">
          <div className="profile-text">
            <div className="student-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2>{student?.name} 학생 <span className="student-id-tag">({student?.id})</span></h2>
              <button
                className="compact-logout-btn"
                onClick={() => { playClickSound(); onLogout(); }}
              >
                <LogOut size={13} /> 로그아웃
              </button>
            </div>
            <p className="welcome-tag">Funday Dallar Market</p>
          </div>
        </div>
      </div>


      {/* DALLAR Balance Card */}
      <div className="balance-card animate-pop">
        <div className="balance-content">
          <div className="balance-amount">
            <span className="amount-number">{student?.points || 0}</span>
            <span className="unit">DALLAR</span>
          </div>
        </div>
      </div>


      {/* Teacher Control Game Event Banner Cards */}
      <div className="game-banner-section">
        <h3 className="section-title">🎮 럭키 이벤트 존</h3>

        <div className="event-buttons-grid">
          <button
            className={`event-btn wheel-btn ${isWheelPlayable ? 'pulse' : ''} ${!isWheelPlayable ? 'locked-btn' : ''}`}
            disabled={!isWheelPlayable}
            onClick={() => {
              if (!gameConfig.isWheelEnabled) {
                alert('선생님이 룰렛 게임 참여를 비활성화(잠금)하였습니다.');
                return;
              }
              if (wheelSpinsLeft <= 0) {
                alert('오늘의 룰렛 1회 도전 기회를 모두 사용하셨습니다! (선생님이 티켓을 부여해 주셔야 재도전 가능)');
                return;
              }
              playClickSound();
              onOpenWheel();
            }}
          >
            <span className="event-icon">{isWheelPlayable ? '🎡' : '🔒'}</span>
            <div className="event-text">
              <strong>100% 당첨 룰렛</strong>
              <span className="badge-count">
                {!gameConfig.isWheelEnabled
                  ? '선생님 승인 대기 중'
                  : wheelSpinsLeft > 0
                  ? `남은 기회: ${wheelSpinsLeft}회`
                  : '기회 소진 (0회)'}
              </span>
            </div>
          </button>

          <button
            className={`event-btn lucky-box-btn ${isLuckyBoxPlayable ? 'pulse' : ''} ${!isLuckyBoxPlayable ? 'locked-btn' : ''}`}
            disabled={!isLuckyBoxPlayable}
            onClick={() => {
              if (!gameConfig.isLuckyBoxEnabled) {
                alert('선생님이 럭키 박스 참여를 비활성화(잠금)하였습니다.');
                return;
              }
              if (luckyBoxSpinsLeft <= 0) {
                alert('오늘의 럭키 박스 1회 도전 기회를 모두 사용하셨습니다! (선생님이 티켓을 부여해 주셔야 재도전 가능)');
                return;
              }
              playClickSound();
              onOpenLuckyBox();
            }}
          >
            <span className="event-icon">{isLuckyBoxPlayable ? '🎁' : '🔒'}</span>
            <div className="event-text">
              <strong>럭키 뽑기 상자</strong>
              <span className="badge-count">
                {!gameConfig.isLuckyBoxEnabled
                  ? '선생님 승인 대기 중'
                  : luckyBoxSpinsLeft > 0
                  ? `남은 기회: ${luckyBoxSpinsLeft}회`
                  : '기회 소진 (0회)'}
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
          <small>카메라로 물품 QR 또는 포인트 QR을 스캔하세요!</small>
        </button>
      </div>

      {/* Market Items & History Toggle Tab */}
      <div className="market-section">
        <div className="section-tabs">
          <button
            className={`tab-btn ${!showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(false)}
          >
            📖 오늘의 말씀
          </button>
          <button
            className={`tab-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(true)}
          >
            <History size={18} /> 내 구매 영수증 ({history.length})
          </button>
        </div>

        {!showHistory ? (
          /* Bible Verses Section */
          <div className="bible-verses-section">
            <div className="verse-card glow-subtle">
              <p className="verse-text">
                "천국은 마치 밭에 감추인 보화와 같으니 사람이 이를 발견한 후 숨겨 두고 기뻐하며 돌아가서 자기의 소유를 다 팔아 그 밭을 사느니라"
              </p>
              <p className="verse-ref">- 마태복음 13:44 -</p>
            </div>
            <div className="verse-card glow-subtle">
              <p className="verse-text">
                "그 때에 천국은 마치 등을 들고 신랑을 맞으러 나간 열 처녀와 같다 하리니"
              </p>
              <p className="verse-ref">- 마태복음 25:1 -</p>
            </div>
          </div>
        ) : (
          /* Receipt Purchase History List */
          <div className="history-list">
            {history.length === 0 ? (
              <div className="empty-history">
                <p>아직 구매한 물품이 없습니다.</p>
                <small>선생님 QR을 스캔하여 달란트로 물품을 구매해보세요!</small>
              </div>
            ) : (
              history.map((record, idx) => (
                <div key={idx} className="history-item-card">
                  <div className="h-info">
                    <span className="h-name">{record.name}</span>
                    <span className="h-time">{record.timestamp}</span>
                  </div>
                  <span className="h-price">-{record.price} DALLAR</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
