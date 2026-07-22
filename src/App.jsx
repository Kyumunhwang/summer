import React, { useState, useEffect } from 'react';
import {
  getStudentData,
  logoutStudent,
  updateStudentPoints,
  addStudentSpins,
  addStudentLuckyBoxSpins,
  addPurchaseRecord,
  deductItemStock,
  getGameConfig,
  updateGameConfig,
  saveAllStudents
} from './utils/storage';
import { playCoinSound, playFanfareSound, playJackpotSound } from './utils/sound';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { TemuWheelModal } from './components/TemuWheelModal';
import { LuckyBoxModal } from './components/LuckyBoxModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ReceiptModal } from './components/ReceiptModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import confetti from 'canvas-confetti';

import { initRealtimeWebSocket, buyItemFromBackend } from './utils/api';

import { saveTeacherItems } from './utils/storage';

export function App() {
  const [view, setView] = useState('student'); // 'student' | 'teacher'
  const [student, setStudent] = useState(getStudentData());
  const [gameConfig, setGameConfig] = useState(getGameConfig());

  // Modals
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isLuckyBoxOpen, setIsLuckyBoxOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null);

  // Refresh student state & game config from storage
  const refreshStudent = () => {
    const updated = getStudentData();
    setStudent(updated);
    setGameConfig(getGameConfig());
  };

  useEffect(() => {
    refreshStudent();

    // 1. Listen for custom event within same window
    const handleConfigChange = (e) => {
      if (e.detail) {
        setGameConfig(e.detail);
      } else {
        setGameConfig(getGameConfig());
      }
    };
    window.addEventListener('dallarGameConfigChanged', handleConfigChange);

    // 2. Listen for storage event across tabs/devices
    const handleStorageChange = () => {
      setGameConfig(getGameConfig());
      setStudent(getStudentData());
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Initialize FastAPI WebSocket Real-time Multi-Device Sync
    initRealtimeWebSocket(
      (updatedItems) => {
        saveTeacherItems(updatedItems);
        window.dispatchEvent(new Event('dallarItemsChanged'));
      },
      (updatedStudents) => {
        saveAllStudents(updatedStudents);
        refreshStudent();
      },
      (updatedConfig) => {
        setGameConfig(updatedConfig);
      }
    );


    // 3. Fast 1-second polling interval for instant multi-device real-time sync
    const interval = setInterval(() => {
      const latestConfig = getGameConfig();
      setGameConfig(prev => {
        if (
          !prev ||
          prev.isWheelEnabled !== latestConfig.isWheelEnabled ||
          prev.isLuckyBoxEnabled !== latestConfig.isLuckyBoxEnabled
        ) {
          return latestConfig;
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('dallarGameConfigChanged', handleConfigChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [view]);

  const handleLogout = () => {
    logoutStudent();
    setStudent(null);
  };

  // Handle QR Scanner result
  const handleScanSuccess = (qrObject) => {
    setIsScannerOpen(false);

    if (qrObject.type === 'DALLAR_ITEM') {
      setSelectedItemForPurchase(qrObject);
    } else if (qrObject.type === 'DALLAR_ADD') {
      const newBalance = updateStudentPoints(qrObject.points);
      refreshStudent();
      playJackpotSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      alert(`🎉 [${qrObject.label || '포인트 지급'}] ${qrObject.points} 달란트가 지급되었습니다! (현재 잔액: ${newBalance}D)`);
    } else if (qrObject.type === 'DALLAR_WHEEL') {
      addStudentSpins(qrObject.spins || 1);
      refreshStudent();
      playCoinSound();
      setIsWheelOpen(true);
    } else if (qrObject.type === 'DALLAR_GAME_TICKET_ADD') {
      if (qrObject.gameKey === 'isWheelEnabled') {
        addStudentSpins(1);
      } else if (qrObject.gameKey === 'isLuckyBoxEnabled') {
        addStudentLuckyBoxSpins(1);
      }
      updateGameConfig({ [qrObject.gameKey]: true });
      refreshStudent();
      playCoinSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      alert(`🎉 [도전권 지급 완료] ${qrObject.gameKey === 'isLuckyBoxEnabled' ? '럭키 뽑기 상자' : '100% 당첨 룰렛'} 1회 도전 기회가 충전되었습니다!`);
    } else if (qrObject.type === 'DALLAR_GAME_CONTROL') {
      if (qrObject.enable) {
        if (qrObject.gameKey === 'isWheelEnabled') addStudentSpins(1);
        if (qrObject.gameKey === 'isLuckyBoxEnabled') addStudentLuckyBoxSpins(1);
      }
      updateGameConfig({ [qrObject.gameKey]: qrObject.enable });
      refreshStudent();
      playCoinSound();
      alert(`🎮 [미니게임 제어] ${qrObject.gameKey === 'isLuckyBoxEnabled' ? '럭키 뽑기 상자' : '룰렛'} 상태가 [${qrObject.enable ? '열림 (1회 기회 부여)' : '잠금'}]으로 변경되었습니다!`);
    } else if ((qrObject.type === 'DALLAR_ITEMS_COMPACT' && qrObject.d) || (qrObject.type === 'DALLAR_ITEMS_SYNC' && qrObject.items)) {
      let restoredItems = [];
      if (qrObject.d) {
        restoredItems = qrObject.d.map((arr, idx) => ({
          id: arr[0] || ('item_qr_' + idx),
          name: cleanItemName(arr[1] || '상품'),
          price: parseInt(arr[2], 10) || 10,
          stock: parseInt(arr[3], 10) || 20,
          category: '일반',
          badge: 'NEW',
          description: '선생님이 등록한 물품'
        }));
      } else {
        restoredItems = qrObject.items;
      }
      saveTeacherItems(restoredItems);
      refreshStudent();
      playJackpotSound();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      alert(`🎉 [물품 동기화 성공] 컴퓨터에서 등록된 최신 물품 ${restoredItems.length}개가 스마트폰으로 100% 동기화되었습니다!`);
    }
 else if (qrObject.type === 'DALLAR_STUDENTS_SYNC' && qrObject.students) {

      saveAllStudents(qrObject.students);
      refreshStudent();
      playJackpotSound();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      alert(`🎉 [학생 명단 동기화 완료] 총 ${qrObject.students.length}명의 학생 계정 및 비밀번호 정보가 휴대폰으로 복사/업데이트되었습니다!`);
    }
  };

  // Handle Purchase Confirmation & Atomic Backend Stock Deduction
  const handleConfirmPurchase = async (item) => {
    if (student) {
      const res = await buyItemFromBackend(item.id, student.id);
      if (res && res.success === false) {
        alert(res.message || '구매에 실패하였습니다.');
        return;
      }
    }
    updateStudentPoints(-item.price);
    deductItemStock(item.id);
    addPurchaseRecord({
      name: item.name,
      price: item.price
    });
    refreshStudent();
  };


  // Handle Bet Wheel Spin Outcome (Strict 1 Spin Deduction)
  const handleWheelSpinComplete = (betAmount, payout, prize) => {
    if (!student) return;
    const netChange = -betAmount + payout;
    updateStudentPoints(netChange);
    addStudentSpins(-1); // Deduct 1 spin ticket
    refreshStudent();
  };

  // Handle Bet Lucky Box Outcome (Strict 1 Spin Deduction)
  const handleLuckyBoxOpen = (selectedBet, payout) => {
    if (!student) return;
    const netChange = -selectedBet + payout;
    updateStudentPoints(netChange);
    addStudentLuckyBoxSpins(-1); // Deduct 1 lucky box ticket
    refreshStudent();
  };

  return (
    <div className="app-root">
      {/* Student ID & Password Login Modal if not authenticated */}
      {!student && view === 'student' && (
        <StudentLoginModal
          onLoginSuccess={refreshStudent}
          onSwitchToTeacher={() => setView('teacher')}
        />
      )}

      {view === 'student' ? (
        <StudentView
          student={student}
          gameConfig={gameConfig}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWheel={() => setIsWheelOpen(true)}
          onOpenLuckyBox={() => setIsLuckyBoxOpen(true)}
          onSelectItemToBuy={(item) => setSelectedItemForPurchase(item)}
          onSwitchToTeacher={() => setView('teacher')}
          onLogout={handleLogout}
        />
      ) : (
        <TeacherView
          onBackToStudent={() => setView('student')}
          onDataChange={refreshStudent}
        />
      )}

      {/* Bet Style Lucky Wheel Modal */}
      <TemuWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        userPoints={student ? student.points : 0}
        onSpinComplete={handleWheelSpinComplete}
      />

      {/* Bet Style Lucky Box Gacha Modal */}
      <LuckyBoxModal
        isOpen={isLuckyBoxOpen}
        onClose={() => setIsLuckyBoxOpen(false)}
        userPoints={student ? student.points : 0}
        onOpenBox={handleLuckyBoxOpen}
      />

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Purchase Confirmation & Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedItemForPurchase}
        onClose={() => setSelectedItemForPurchase(null)}
        item={selectedItemForPurchase}
        studentPoints={student ? student.points : 0}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}

export default App;
