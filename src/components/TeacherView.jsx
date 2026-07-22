import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getTeacherItems,
  saveTeacherItems,
  addTeacherItem,
  deleteTeacherItem,
  syncTeacherItems,
  encodeItemQR,
  encodeAllItemsQR,
  encodePointQR,
  encodeWheelQR,
  encodeGameTicketQR,
  encodeGameControlQR,
  resetAllData,
  parseCSVToItems,
  parseCSVToStudents,
  exportItemsToCSV,
  exportStudentsToCSV,
  getAllStudents,
  syncAllStudents,
  getGameConfig,
  updateGameConfig
} from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { PlusCircle, Trash2, QrCode, Award, FileSpreadsheet, Download, Upload, Lock, Unlock, ShieldAlert, Users, RefreshCw } from 'lucide-react';
import { StudentAccountListModal } from './StudentAccountListModal';

export const TeacherView = ({ onBackToStudent, onDataChange }) => {
  const [items, setItems] = useState(getTeacherItems());
  const [gameConfig, setGameConfig] = useState(getGameConfig());
  const [activeQRModal, setActiveQRModal] = useState(null); // { title, qrData, subtitle }

  // Student Accounts Modal State
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  // Google Sheet CSV Modal State
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvDataType, setCsvDataType] = useState('items'); // 'items' | 'students'

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(10);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemStock, setNewItemStock] = useState(20);

  const handleToggleGame = (gameKey) => {
    playClickSound();
    const updated = updateGameConfig({
      [gameKey]: !gameConfig[gameKey]
    });
    setGameConfig(updated);
    if (onDataChange) onDataChange();
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    playClickSound();
    const updated = addTeacherItem({
      name: newItemName,
      price: parseInt(newItemPrice, 10),
      description: newItemDesc || 'Summer School Special Item',
      stock: parseInt(newItemStock, 10) || 20,
      badge: 'NEW'
    });

    setItems(updated);
    setNewItemName('');
    setNewItemPrice(10);
    setNewItemDesc('');
    setNewItemStock(20);
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

  const handleSyncItemsDirect = () => {
    playCoinSound();
    const currentItems = getTeacherItems();
    saveTeacherItems(currentItems);
    setItems(currentItems);
    if (onDataChange) onDataChange();
    alert(`🎉 교사 컴퓨터의 전체 물품 목록(${currentItems.length}개)이 스마트폰 및 FastAPI 백엔드로 100% 즉시 동기화되었습니다!`);
  };


  const showAllItemsSyncQR = () => {
    playClickSound();
    const currentItems = getTeacherItems();
    setActiveQRModal({
      title: `📲 전체 물품 동기화 QR (총 ${currentItems.length}개)`,
      subtitle: `스마트폰 카메라로 이 QR 코드를 스캔하면 컴퓨터의 최신 물품 ${currentItems.length}개가 휴대폰으로 100% 즉시 동기화됩니다!`,
      qrData: encodeAllItemsQR()
    });
  };

  const showItemQR = (item) => {
    playClickSound();
    setActiveQRModal({
      title: `[물품 QR] ${item.name}`,
      subtitle: `가격: ${item.price} 달란트 (남은 수량: ${item.stock ?? 20}개)`,
      qrData: encodeItemQR(item)
    });
  };

  const showRewardPointQR = (amount) => {
    playClickSound();
    setActiveQRModal({
      title: `🌟 칭찬 ${amount} 달란트 지급 QR`,
      subtitle: '학생이 스캔하면 달란트가 즉시 지급됩니다!',
      qrData: encodePointQR(amount, `${amount} 달란트 칭찬 쿠폰`)
    });
  };

  const showWheelQR = () => {
    playClickSound();
    setActiveQRModal({
      title: `🎡 Temu 럭키 룰렛 티켓 QR`,
      subtitle: '학생이 스캔하면 100% 당첨 룰렛이 실행됩니다!',
      qrData: encodeWheelQR(1)
    });
  };

  const showGameTicketQR = (gameKey, name) => {
    playClickSound();
    setActiveQRModal({
      title: `🎟️ ${name} 1회 도전 티켓 부여 QR`,
      subtitle: `기회를 모두 사용한 학생이 이 QR을 스캔하면 ${name} 1회 도전 기회가 충전됩니다!`,
      qrData: encodeGameTicketQR(gameKey)
    });
  };

  const handleSyncStudentsDirect = () => {
    playCoinSound();
    const synced = syncAllStudents();
    if (onDataChange) onDataChange();
    alert(`🎉 학생 명단 및 비밀번호 데이터가 완벽하게 동기화되었습니다! (총 ${synced.length}명)`);
  };

  // Google Sheet CSV Import Handler (Both Items & Students)
  const handleImportCSV = () => {
    if (!csvText.trim()) {
      alert('CSV 텍스트를 입력하거나 구글 시트 내용을 붙여넣으세요.');
      return;
    }

    try {
      if (csvDataType === 'items') {
        const parsedItems = parseCSVToItems(csvText);
        if (parsedItems.length === 0) {
          alert('올바른 상품 CSV 형식이 아닙니다.');
          return;
        }
        saveTeacherItems(parsedItems);
        setItems(parsedItems);
        alert(`🎉 ${parsedItems.length}개의 상품 데이터가 Google Sheet/CSV에서 성공적으로 불러와졌습니다! FastAPI 백엔드 및 스마트폰으로 0.01초 실시간 동기화되었습니다.`);

      } else {
        const parsedStudents = parseCSVToStudents(csvText);
        if (!parsedStudents || parsedStudents.length === 0) {
          alert('올바른 학생 CSV 형식이 아닙니다.');
          return;
        }
        alert(`🎉 ${parsedStudents.length}명의 학생 ID, 비밀번호, 포인트 지갑 데이터가 업로드되었습니다!`);
      }
      setShowCSVModal(false);
      setCsvText('');
      if (onDataChange) onDataChange();
    } catch (err) {
      alert('CSV 데이터를 파싱하는 중 오류가 발생했습니다. 구글 시트 형식을 확인하세요.');
    }
  };

  // Export Items CSV File Download
  const handleDownloadCSV = () => {
    const csvContent = exportItemsToCSV(items);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'summer_school_dallar_items.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Students CSV File Download (ID, Name, Password, Points)
  const handleDownloadStudentsCSV = () => {
    const students = getAllStudents();
    const csvContent = exportStudentsToCSV(students);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'summer_school_students_accounts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    if (window.confirm('경고: 모든 학생 데이터와 물품이 초기화됩니다. 계속할까요?')) {
      resetAllData();
      setItems(getTeacherItems());
      setGameConfig(getGameConfig());
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
            <p>Dallar Market 물품 관리 및 학생 계정/포인트 CSV 제어</p>
          </div>
        </div>

        <div className="t-top-actions">
          <button className="sync-link-btn" onClick={handleSyncItemsDirect}>
            <RefreshCw size={18} /> 🔄 전체 물품 즉시 동기화
          </button>


          <button className="sync-link-btn" onClick={handleSyncStudentsDirect}>
            <RefreshCw size={18} /> 🔄 학생 명단 즉시 동기화
          </button>

          <button className="students-list-btn" onClick={() => { playClickSound(); setShowStudentsModal(true); }}>
            <Users size={18} /> 👥 가입 학생 계정/비밀번호 조회
          </button>

          <button className="csv-download-btn student-csv-btn" onClick={handleDownloadStudentsCSV}>
            <Users size={18} /> 🦁 학생 계정 CSV 다운로드
          </button>

          <button className="csv-btn" onClick={() => { playClickSound(); setShowCSVModal(true); }}>
            <FileSpreadsheet size={18} /> Google Sheet / CSV 불러오기
          </button>

          <button className="switch-student-btn" onClick={() => { playClickSound(); onBackToStudent(); }}>
            📱 학생 화면으로 이동
          </button>
        </div>
      </div>

      {/* Game Event Access Controller Section */}
      <div className="admin-card game-control-section glow-subtle">
        <h3>🎮 학생 미니게임 1회 기회 부여 QR 패널</h3>
        <p className="card-sub">기회를 모두 사용했거나 미니게임을 진행할 학생에게 아래 <strong>[🎫 1회 기회 부여 QR]</strong>을 화면으로 보여주세요!</p>

        <div className="game-control-grid">
          <div className="g-control-card unlocked">
            <div className="g-info">
              <span className="g-icon">🎡</span>
              <div>
                <h4>100% 당첨 럭키 룰렛</h4>
                <p>학생이 스캔 시 룰렛 1회 도전 기회가 즉시 부여됩니다.</p>
              </div>
            </div>

            <div className="g-action-btns">
              <button
                className="qr-share-btn"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '800' }}
                onClick={() => showGameTicketQR('isWheelEnabled', '룰렛')}
              >
                <QrCode size={18} /> 🎫 1회 기회 부여 QR
              </button>
            </div>
          </div>

          <div className="g-control-card unlocked">
            <div className="g-info">
              <span className="g-icon">🎁</span>
              <div>
                <h4>럭키 뽑기 상자 (Gacha)</h4>
                <p>학생이 스캔 시 럭키 박스 1회 도전 기회가 즉시 부여됩니다.</p>
              </div>
            </div>

            <div className="g-action-btns">
              <button
                className="qr-share-btn"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '800' }}
                onClick={() => showGameTicketQR('isLuckyBoxEnabled', '럭키 박스')}
              >
                <QrCode size={18} /> 🎫 1회 기회 부여 QR
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="teacher-grid">
        {/* Quick Point & Wheel QR Generators */}
        <div className="admin-card quick-qr-section">
          <h3>⚡ 현장 포인트 & 룰렛 지급 QR 생성기</h3>
          <p className="card-sub">미션을 완료한 학생들에게 아래 QR 코드를 화면으로 보여주세요!</p>

          <div className="quick-qr-buttons">
            <button className="q-btn green" onClick={() => showRewardPointQR(5)}>
              💰 5 달란트 지급 QR
            </button>
            <button className="q-btn gold" onClick={() => showRewardPointQR(10)}>
              🔥 10 달란트 지급 QR
            </button>
          </div>
        </div>

        {/* New Item Registration Form */}
        <div className="admin-card add-item-section">
          <h3>➕ 신규 판매 물품 등록</h3>

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

            <div className="form-row">
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
                <label>초기 재고 수량</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={newItemStock}
                  onChange={(e) => setNewItemStock(e.target.value)}
                  required
                />
              </div>
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
          <div className="header-action-group">
            <button className="csv-download-btn" onClick={handleSyncItemsDirect} style={{ borderColor: '#00e676', color: '#00e676', fontWeight: '800' }}>
              <RefreshCw size={16} /> 🔄 전체 물품 즉시 동기화
            </button>
            <button className="reset-data-btn" onClick={handleResetData}>
              <ShieldAlert size={16} /> 데이터 초기화
            </button>
          </div>


        </div>

        <div className="teacher-items-grid">
          {items.map((item) => (
            <div key={item.id} className="teacher-item-card">
              <div className="t-item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <div className="t-badges">
                  <span className="t-price-badge">{item.price} DALLAR</span>
                  <span className={`t-stock-badge ${item.stock <= 0 ? 'out' : ''}`}>
                    {item.stock <= 0 ? '품절 (0개)' : `재고: ${item.stock}개`}
                  </span>
                </div>
              </div>

              <div className="t-item-actions">
                <button className="show-qr-btn" onClick={() => showItemQR(item)}>
                  <QrCode size={18} /> QR
                </button>

                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Account List & Password Modal */}
      <StudentAccountListModal
        isOpen={showStudentsModal}
        onClose={() => { setShowStudentsModal(false); if (onDataChange) onDataChange(); }}
      />

      {/* Google Sheet CSV Import Modal */}
      {showCSVModal && (
        <div className="modal-overlay" onClick={() => setShowCSVModal(false)}>
          <div className="modal-content csv-modal" onClick={e => e.stopPropagation()}>
            <h3>📊 Google Sheet / CSV 데이터 업로드 및 불러오기</h3>
            <p className="sub-text">구글 시트에서 작성한 상품 목록 또는 학생 ID/비밀번호/포인트를 CSV 형태로 붙여넣으세요!</p>

            <div className="csv-type-tabs">
              <button
                className={`type-tab ${csvDataType === 'items' ? 'active' : ''}`}
                onClick={() => setCsvDataType('items')}
              >
                📦 상품 목록 CSV 불러오기
              </button>
              <button
                className={`type-tab ${csvDataType === 'students' ? 'active' : ''}`}
                onClick={() => setCsvDataType('students')}
              >
                🦁 학생 ID/비밀번호/포인트 CSV 불러오기
              </button>
            </div>

            <textarea
              className="csv-textarea"
              rows={8}
              placeholder={
                csvDataType === 'items'
                  ? 'id,name,price,stock,category,badge,description\nitem_01,프리미엄 아이스크림,10,30,간식,HOT,달콤 시원한 여름 꿀맛 아이스크림'
                  : 'id,name,password,points,spinsLeft\nstd_01,김민준,1234,120,1\nstd_02,이서연,1234,100,1\nstd_03,박지호,1234,150,1'
              }
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCSVModal(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleImportCSV}>
                <Upload size={16} /> 구글 시트 / CSV 데이터 업로드 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Display Modal (For Tablet / Phone display to Students) */}
      {activeQRModal && (
        <div className="modal-overlay" onClick={() => setActiveQRModal(null)}>
          <div className="qr-display-card animate-pop" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveQRModal(null)}>
              ✕
            </button>

            <div className="qr-display-header">
              <h2>{activeQRModal.title}</h2>
              <p>{activeQRModal.subtitle}</p>
            </div>

            <div className="qr-code-box">
              <QRCodeSVG
                value={activeQRModal.qrData}
                size={240}
                bgColor={'#ffffff'}
                fgColor={'#111111'}
                level={'L'}

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
