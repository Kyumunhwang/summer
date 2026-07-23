import React, { useState, useEffect } from 'react';
import {
  getStudentData,
  saveStudentData,
  updateStudentPoints,
  addStudentSpins,
  addPurchaseRecord
} from './utils/storage';
import { playCoinSound, playFanfareSound, playJackpotSound } from './utils/sound';
import { MainLoginScreen } from './components/MainLoginScreen';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { TemuWheelModal } from './components/TemuWheelModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ReceiptModal } from './components/ReceiptModal';
import confetti from 'canvas-confetti';

export function App() {
  const [view, setView] = useState('login'); // 'login' | 'student' | 'teacher'
  const [student, setStudent] = useState(getStudentData());

  // Modals
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null);

  // Refresh student state from storage
  const refreshStudent = () => {
    setStudent(getStudentData());
  };

  useEffect(() => {
    refreshStudent();
  }, [view]);

  // Handle QR Scanner result
  const handleScanSuccess = (qrObject) => {
    setIsScannerOpen(false);

    if (qrObject.type === 'STAMP_ITEM' || qrObject.type === 'DALLAR_ITEM') {
      // Open Purchase Confirmation Receipt modal
      setSelectedItemForPurchase(qrObject);
    } else if (qrObject.type === 'STAMP_ADD' || qrObject.type === 'DALLAR_ADD') {
      // Add points immediately
      const newBalance = updateStudentPoints(qrObject.points);
      refreshStudent();
      playJackpotSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      alert(`🎉 [${qrObject.label || '스탬프 지급'}] ${qrObject.points} 스탬프가 지급되었습니다! (현재 잔액: ${newBalance} STAMP)`);
    } else if (qrObject.type === 'STAMP_WHEEL' || qrObject.type === 'DALLAR_WHEEL') {
      // Add wheel ticket & open wheel modal
      addStudentSpins(qrObject.spins || 1);
      refreshStudent();
      playCoinSound();
      alert('🎉 [선생님 승인] 룰렛 1회 도전권이 승인되었습니다!');
      setIsWheelOpen(true);
    }
  };

  // Handle Purchase Confirmation
  const handleConfirmPurchase = (item) => {
    updateStudentPoints(-item.price);
    addPurchaseRecord({
      name: item.name,
      price: item.price,
      icon: item.icon
    });
    refreshStudent();
  };

  // Handle Spin Start (consume 1 ticket immediately when SPIN is clicked)
  const handleWheelSpinStart = () => {
    addStudentSpins(-1);
    refreshStudent();
  };

  // Handle Temu Wheel Spin Win
  const handleWheelWin = (prize) => {
    if (prize && prize.value > 0) {
      updateStudentPoints(prize.value);
    }
    refreshStudent();
  };

  return (
    <div className="app-root">
      {view === 'login' ? (
        <MainLoginScreen
          onStudentLoginSuccess={(loggedStudent) => {
            setStudent(loggedStudent);
            setView('student');
          }}
          onTeacherLoginSuccess={() => {
            setView('teacher');
          }}
        />
      ) : view === 'student' ? (
        <StudentView
          student={student}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWheel={() => setIsWheelOpen(true)}
          onLogout={() => setView('login')}
        />
      ) : (
        <TeacherView
          onBackToStudent={() => setView('login')}
          onDataChange={refreshStudent}
        />
      )}

      {/* Temu Style 100% Win Wheel Modal */}
      <TemuWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onWin={handleWheelWin}
        onSpinStart={handleWheelSpinStart}
        spinsLeft={student.spinsLeft || 0}
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
        studentPoints={student.points}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}

export default App;
