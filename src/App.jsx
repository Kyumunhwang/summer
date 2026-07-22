import React, { useState, useEffect } from 'react';
import {
  getStudentData,
  saveStudentData,
  updateStudentPoints,
  addStudentSpins,
  addPurchaseRecord
} from './utils/storage';
import { playCoinSound, playFanfareSound, playJackpotSound } from './utils/sound';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { TemuWheelModal } from './components/TemuWheelModal';
import { LuckyBoxModal } from './components/LuckyBoxModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ReceiptModal } from './components/ReceiptModal';
import confetti from 'canvas-confetti';

export function App() {
  const [view, setView] = useState('student'); // 'student' | 'teacher'
  const [student, setStudent] = useState(getStudentData());

  // Modals
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isLuckyBoxOpen, setIsLuckyBoxOpen] = useState(false);
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

    if (qrObject.type === 'DALLAR_ITEM') {
      // Open Purchase Confirmation Receipt modal
      setSelectedItemForPurchase(qrObject);
    } else if (qrObject.type === 'DALLAR_ADD') {
      // Add points immediately
      const newBalance = updateStudentPoints(qrObject.points);
      refreshStudent();
      playJackpotSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      alert(`🎉 [${qrObject.label || '포인트 지급'}] ${qrObject.points} 달란트가 지급되었습니다! (현재 잔액: ${newBalance}D)`);
    } else if (qrObject.type === 'DALLAR_WHEEL') {
      // Add wheel ticket & open wheel modal
      addStudentSpins(qrObject.spins || 1);
      refreshStudent();
      playCoinSound();
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

  // Handle Temu Wheel Spin Win
  const handleWheelWin = (prize) => {
    if (prize.type === 'points' || prize.type === 'jackpot') {
      updateStudentPoints(prize.value);
    } else if (prize.type === 'double') {
      // Double current balance
      updateStudentPoints(student.points);
    }
    // Deduct spin ticket
    addStudentSpins(-1);
    refreshStudent();
  };

  // Handle Lucky Box Gacha Open
  const handleLuckyBoxOpen = (cost, wonPoints) => {
    updateStudentPoints(-cost + wonPoints);
    refreshStudent();
  };

  return (
    <div className="app-root">
      {view === 'student' ? (
        <StudentView
          student={student}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWheel={() => setIsWheelOpen(true)}
          onOpenLuckyBox={() => setIsLuckyBoxOpen(true)}
          onSelectItemToBuy={(item) => setSelectedItemForPurchase(item)}
          onSwitchToTeacher={() => setView('teacher')}
        />
      ) : (
        <TeacherView
          onBackToStudent={() => setView('student')}
          onDataChange={refreshStudent}
        />
      )}

      {/* Temu Style 100% Win Wheel Modal */}
      <TemuWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onWin={handleWheelWin}
      />

      {/* Lucky Box Gacha Modal */}
      <LuckyBoxModal
        isOpen={isLuckyBoxOpen}
        onClose={() => setIsLuckyBoxOpen(false)}
        userPoints={student.points}
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
        studentPoints={student.points}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}

export default App;
