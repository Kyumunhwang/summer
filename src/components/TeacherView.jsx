import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getTeacherItems,
  addTeacherItem,
  deleteTeacherItem,
  encodeItemQR,
  encodePointQR,
  encodeWheelQR,
  resetAllData
} from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { PlusCircle, Trash2, QrCode, Sparkles, RefreshCw, Gift, ShieldAlert, Award } from 'lucide-react';

export const TeacherView = ({ onBackToStudent, onDataChange }) => {
  const [items, setItems] = useState(getTeacherItems());
  const [activeQRModal, setActiveQRModal] = useState(null); // { title, qrData, icon }

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(10);
  const [newItemIcon, setNewItemIcon] = useState('🎁');
  const [newItemDesc, setNewItemDesc] = useState('');

  const iconsList = ['🍦', '🥤', '🍿', '🧸', '🎨', '👑', '🎟️', '🍔', '🎁', '⚽', '🎮', '🍉'];

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    playClickSound();
    const updated = addTeacherItem({
      name: newItemName,
      price: parseInt(newItemPrice, 10),
      icon: newItemIcon,
      description: newItemDesc || 'Summer School Special Item',
      stock: 20,
      badge: 'NEW'
    });

    setItems(updated);
    setNewItemName('');
    setNewItemPrice(10);
    setNewItemDesc('');
    if (onDataChange) onDataChange();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('이 물품을 삭제하시겠습니까?')) {
      playClickSound();
      const updated = deleteTeacherItem(id);
      setItems(updated);
      if (onDataChange) onDataChange();
    }
  };

  const showItemQR = (item) => {
    playClickSound();
    setActiveQRModal({
      title: `[물품 QR] ${item.name}`,
      subtitle: `가격: ${item.price} 달란트`,
      qrData: encodeItemQR(item),
      icon: item.icon
    });
  };

  const showRewardPointQR = (amount) => {
    playClickSound();
    setActiveQRModal({
      title: `🌟 칭찬 ${amount} 달란트 지급 QR`,
      subtitle: '학생이 스캔하면 달란트가 즉시 지급됩니다!',
      qrData: encodePointQR(amount, `${amount} 달란트 칭찬 쿠폰`),
      icon: '💰'
    });
  };

  const showWheelQR = () => {
    playClickSound();
    setActiveQRModal({
      title: `🎡 Temu 럭키 룰렛 티켓 QR`,
      subtitle: '학생이 스캔하면 100% 당첨 룰렛이 실행됩니다!',
      qrData: encodeWheelQR(1),
      icon: '🎰'
    });
  };

  const handleResetData = () => {
    if (window.confirm('경고: 모든 학생 데이터와 물품이 초기화됩니다. 계속할까요?')) {
      resetAllData();
      setItems(getTeacherItems());
      if (onDataChange) onDataChange();
      alert('초기화되었습니다.');
    }
  };

  return (
    <div className="teacher-container">
      {/* Teacher Header Bar */}
      <div className="teacher-header-bar">
        <div className="t-brand">
          <Award className="t-logo-icon" size={28} />
          <div>
            <h2>TEACHER ADMIN PANEL</h2>
            <p>Dallar Market 물품 관리 및 포인트 QR 생성기</p>
          </div>
        </div>

        <button className="switch-student-btn" onClick={() => { playClickSound(); onBackToStudent(); }}>
          📱 학생 화면으로 이동
        </button>
      </div>

      <div className="teacher-grid">
        {/* Quick Point & Wheel QR Generators */}
        <div className="admin-card quick-qr-section">
          <h3>⚡ 현장 포인트 & 룰렛 지급 QR 생성기</h3>
          <p className="card-sub">미션을 완료한 학생들에게 아래 QR 코드를 화면으로 보여주세요!</p>

          <div className="quick-qr-buttons">
            <button className="q-btn green" onClick={() => showRewardPointQR(20)}>
              💰 20 달란트 지급 QR
            </button>
            <button className="q-btn gold" onClick={() => showRewardPointQR(50)}>
              🔥 50 달란트 지급 QR
            </button>
            <button className="q-btn purple" onClick={() => showRewardPointQR(100)}>
              👑 100 달란트 잭팟 QR
            </button>
            <button className="q-btn temu-red" onClick={showWheelQR}>
              🎡 Temu 럭키 룰렛 티켓 QR
            </button>
          </div>
        </div>

        {/* New Item Registration Form */}
        <div className="admin-card add-item-section">
          <h3>➕ 신규 판매 물품 등록</h3>

          <form onSubmit={handleCreateItem} className="item-form">
            <div className="form-group">
              <label>아이콘 선택</label>
              <div className="icon-selector">
                {iconsList.map((ic) => (
                  <span
                    key={ic}
                    className={`icon-chip ${newItemIcon === ic ? 'selected' : ''}`}
                    onClick={() => setNewItemIcon(ic)}
                  >
                    {ic}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>물품 이름</label>
              <input
                type="text"
                placeholder="예: 맛있는 슬러시"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>판매 가격 (달란트)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>설명 (선택)</label>
              <input
                type="text"
                placeholder="간략한 물품 설명"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="add-submit-btn">
              <PlusCircle size={18} /> 물품 즉시 추가하기
            </button>
          </form>
        </div>
      </div>

      {/* Item List with QR View Buttons */}
      <div className="admin-card item-list-section">
        <div className="section-header">
          <h3>🏷️ 현재 등록된 물품 목록 ({items.length}개)</h3>
          <button className="reset-data-btn" onClick={handleResetData}>
            <ShieldAlert size={16} /> 데이터 초기화
          </button>
        </div>

        <div className="teacher-items-grid">
          {items.map((item) => (
            <div key={item.id} className="teacher-item-card">
              <div className="t-item-icon">{item.icon}</div>
              <div className="t-item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="t-price-badge">{item.price} DALLAR</span>
              </div>

              <div className="t-item-actions">
                <button className="show-qr-btn" onClick={() => showItemQR(item)}>
                  <QrCode size={18} /> QR 띄우기
                </button>
                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Display Modal (For Tablet / Phone display to Students) */}
      {activeQRModal && (
        <div className="modal-overlay" onClick={() => setActiveQRModal(null)}>
          <div className="qr-display-card animate-pop" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveQRModal(null)}>
              ✕
            </button>

            <div className="qr-display-header">
              <span className="qr-big-icon">{activeQRModal.icon}</span>
              <h2>{activeQRModal.title}</h2>
              <p>{activeQRModal.subtitle}</p>
            </div>

            <div className="qr-code-box">
              <QRCodeSVG
                value={activeQRModal.qrData}
                size={240}
                bgColor={'#ffffff'}
                fgColor={'#111111'}
                level={'H'}
                includeMargin={true}
              />
            </div>

            <p className="qr-hint-text">📱 학생 휴대폰 카메라로 위 QR 코드를 스캔하세요!</p>

            <button className="claim-btn" onClick={() => setActiveQRModal(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
