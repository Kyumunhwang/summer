import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getTeacherItems,
  addTeacherItem,
  deleteTeacherItem,
  encodeItemQR,
  encodePointQR,
  encodeWheelQR,
  encodeBoxQR,
  addStudentSpins,
  addStudentBoxes,
  downloadSampleCSV,
  parseCSVAndSaveStudents,
  getStudentsList,
  downloadItemsSampleCSV,
  parseCSVAndSaveItems,
  resetAllData
} from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { PlusCircle, Trash2, QrCode, Sparkles, RefreshCw, Gift, ShieldAlert, Award, CheckCircle } from 'lucide-react';

export const TeacherView = ({ onBackToStudent, onDataChange }) => {
  const [items, setItems] = useState(getTeacherItems());
  const [studentsRoster, setStudentsRoster] = useState(getStudentsList());
  const [activeQRModal, setActiveQRModal] = useState(null); // { title, qrData, icon }
  const [inlineQR, setInlineQR] = useState(null); // Inline QR displayed only when button clicked

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(10);

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    playClickSound();
    const updated = addTeacherItem({
      name: newItemName,
      price: parseInt(newItemPrice, 10),
      stock: 20
    });

    setItems(updated);
    setNewItemName('');
    setNewItemPrice(10);
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
      subtitle: `가격: ${item.price} 스탬프`,
      qrData: encodeItemQR(item),
      icon: '🎁'
    });
  };

  const showRewardPointQR = (amount) => {
    playClickSound();
    setActiveQRModal({
      title: `🌟 칭찬 ${amount} 스탬프 지급 QR`,
      subtitle: '학생이 스캔하면 스탬프가 즉시 지급됩니다!',
      qrData: encodePointQR(amount, `${amount} 스탬프 칭찬 쿠폰`),
      icon: '💰'
    });
  };

  const setInlineWheelQR = () => {
    playClickSound();
    setInlineQR({
      type: 'WHEEL',
      title: '🎡 룰렛 +1회 도전 승인 QR',
      subtitle: '이 QR 코드를 스캔한 학생에게만 룰렛 1회 도전권이 승인됩니다!',
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
            <p>STAMP Market 물품 관리 및 스탬프 QR 생성기</p>
          </div>
        </div>

        <button className="switch-student-btn" onClick={() => { playClickSound(); onBackToStudent(); }}>
          📱 학생 화면으로 이동
        </button>
      </div>

      <div className="teacher-grid">
        {/* Quick Point & Wheel QR Generators */}
        <div className="admin-card quick-qr-section">
          <h3>⚡ 100% 당첨 룰렛 실시간 승인 QR 생성기</h3>
          <p className="card-sub">아래 버튼을 누르면 룰렛 승인 QR 코드가 생성되며, 스캔한 학생만 1회 도전할 수 있습니다!</p>

          <div className="instant-grant-row" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              className="instant-grant-btn active"
              onClick={setInlineWheelQR}
              style={{
                flex: 1,
                padding: '14px',
                background: 'var(--temu-red)',
                border: '2px solid var(--temu-yellow)',
                color: 'white',
                borderRadius: '14px',
                fontWeight: '900',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ⚡ 룰렛 +1회 승인 QR 코드 생성하기
            </button>
          </div>

          {/* Inline Live QR Code Box (Displayed right below the buttons) */}
          {inlineQR && (
            <div
              className="inline-qr-display-box animate-pop"
              style={{
                background: '#FFFFFF',
                color: '#111111',
                padding: '18px',
                borderRadius: '20px',
                textAlign: 'center',
                marginBottom: '16px',
                boxShadow: '0 8px 25px rgba(255, 199, 0, 0.3)',
                border: '3px solid var(--temu-yellow)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>{inlineQR.icon}</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111' }}>{inlineQR.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '12px' }}>{inlineQR.subtitle}</p>

              <div style={{ display: 'inline-block', padding: '10px', background: '#FFF', borderRadius: '12px', border: '1px solid #EEE' }}>
                <QRCodeSVG
                  value={inlineQR.qrData}
                  size={210}
                  bgColor={'#ffffff'}
                  fgColor={'#111111'}
                  level={'H'}
                  includeMargin={true}
                />
              </div>

              <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--temu-red)', marginTop: '8px' }}>
                📱 학생 휴대폰 카메라로 위 QR 코드를 스캔하세요!
              </p>
            </div>
          )}

          <div className="quick-qr-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              className="q-btn gold"
              style={{ gridColumn: 'span 2', padding: '12px', background: 'var(--gold-gradient)', color: '#111', fontWeight: '900', fontSize: '0.95rem' }}
              onClick={() => {
                playClickSound();
                setActiveQRModal({
                  title: '🌐 학생 휴대폰 접속용 QR 코드',
                  subtitle: '스마트폰 카메라로 스캔하면 즉시 접속합니다! (https://192.168.5.118:5173/)',
                  qrData: 'https://192.168.5.118:5173/',
                  icon: '📱'
                });
              }}
            >
              🌐 학생 접속용 URL QR 코드 띄우기 (https://192.168.5.118:5173/)
            </button>
            <button className="q-btn green" onClick={() => showRewardPointQR(1)}>
              🪙 1 스탬프 지급 QR
            </button>
            <button className="q-btn gold" onClick={() => showRewardPointQR(2)}>
              🪙 2 스탬프 지급 QR
            </button>
            <button className="q-btn purple" onClick={() => showRewardPointQR(5)}>
              💰 5 스탬프 지급 QR
            </button>
            <button className="q-btn temu-red" onClick={() => showRewardPointQR(10)}>
              🔥 10 스탬프 지급 QR
            </button>
          </div>
        </div>

        {/* CSV Student Roster Management Section */}
        <div className="admin-card csv-management-section">
          <h3>👨‍🎓 30명 학생 명단 & CSV 관리</h3>
          <p className="card-sub">학생 ID/비밀번호/이름 양식 CSV를 다운로드받거나 새로운 명단 CSV를 업로드하세요!</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={downloadSampleCSV}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'var(--gold-gradient)',
                color: '#111',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              📥 30명 학생 명단 CSV 양식 다운로드
            </button>

            <label
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1.5px dashed var(--temu-yellow)',
                color: 'var(--temu-yellow)',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              📤 학생 명단 CSV 파일 업로드
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const result = parseCSVAndSaveStudents(evt.target.result);
                      if (result) {
                        setStudentsRoster(result);
                        if (onDataChange) onDataChange();
                        alert(`🎉 성공! ${result.length}명의 학생 명단이 새로 적용되었습니다!`);
                      } else {
                        alert('CSV 파일 형식을 확인해주세요. (ID,Password,Name,Points)');
                      }
                    };
                    reader.readAsText(file, 'UTF-8');
                  }
                }}
              />
            </label>
          </div>

          <div className="student-roster-preview" style={{ maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '10px' }}>
            <table style={{ width: '100%', fontSize: '0.75rem', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--temu-yellow)' }}>
                  <th style={{ padding: '4px' }}>ID</th>
                  <th style={{ padding: '4px' }}>PW(PIN)</th>
                  <th style={{ padding: '4px' }}>이름</th>
                  <th style={{ padding: '4px' }}>스탬프</th>
                </tr>
              </thead>
              <tbody>
                {studentsRoster.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '4px', fontWeight: '700' }}>{s.id}</td>
                    <td style={{ padding: '4px', color: '#AAA' }}>{s.password}</td>
                    <td style={{ padding: '4px' }}>{s.name}</td>
                    <td style={{ padding: '4px', color: 'var(--temu-yellow)', fontWeight: '800' }}>{s.points} STAMP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Item Registration Form */}
        <div className="admin-card add-item-section">
          <h3>➕ 신규 판매 물품 등록 & CSV 일괄 관리</h3>
          <p className="card-sub">물품을 직접 등록하거나, CSV 파일로 한번에 일괄 등록하세요! (자동으로 QR 코드가 100% 즉시 생성됩니다)</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={downloadItemsSampleCSV}
              style={{
                flex: 1,
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1.5px solid var(--temu-yellow)',
                color: 'var(--temu-yellow)',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              📥 물품 목록 CSV 양식 다운로드
            </button>

            <label
              style={{
                flex: 1,
                padding: '12px 14px',
                background: 'var(--temu-gradient)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              📤 물품 목록 CSV 일괄 업로드
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const result = parseCSVAndSaveItems(evt.target.result);
                      if (result) {
                        setItems(getTeacherItems());
                        if (onDataChange) onDataChange();
                        alert(`🎉 성공! ${result.length}개의 판매 물품이 일괄 등록되고 QR 코드가 자동 생성되었습니다!`);
                      } else {
                        alert('CSV 파일 형식을 확인해주세요. (Name,Price,Stock)');
                      }
                    };
                    reader.readAsText(file, 'UTF-8');
                  }
                }}
              />
            </label>
          </div>

          <form onSubmit={handleCreateItem} className="item-form">
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
              <label>판매 가격 (스탬프)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                required
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
              <div className="t-item-info">
                <h4>{item.name}</h4>
                <span className="t-price-badge">{item.price} STAMP</span>
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
