import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { playClickSound, playCoinSound, playErrorSound } from '../utils/sound';
import { parseQRData, getTeacherItems } from '../utils/storage';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanError, setScanError] = useState('');
  const [simMode, setSimMode] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || simMode) return;

    // Initialize HTML5 QR Scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader-region',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success callback
        playCoinSound();
        const parsed = parseQRData(decodedText);
        if (parsed) {
          scanner.clear();
          onScanSuccess(parsed);
        } else {
          setScanError('인식할 수 없는 Dallar Market QR 코드입니다.');
          playErrorSound();
        }
      },
      (error) => {
        // Ignored minor frame errors
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.warn('Scanner clear error:', e);
        }
      }
    };
  }, [isOpen, simMode]);

  if (!isOpen) return null;

  // Simulation Helpers for easy testing
  const sampleItems = getTeacherItems();

  const handleSimulateScan = (qrObject) => {
    playClickSound();
    playCoinSound();
    onScanSuccess(qrObject);
  };

  return (
    <div className="modal-overlay">
      <div className="qr-modal-card glow-temu">
        <button
          className="close-btn"
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
          <X size={24} />
        </button>

        <div className="temu-header">
          <div className="temu-badge-flash">📷 QR CAMERA SCANNER</div>
          <h2>DALLAR SCANNER</h2>
          <p>선생님의 물품 QR 또는 포인트 QR을 카메라에 비춰주세요!</p>
        </div>

        {/* Tab Switcher: Live Camera vs Simulation */}
        <div className="scan-mode-tabs">
          <button
            className={`mode-tab ${!simMode ? 'active' : ''}`}
            onClick={() => setSimMode(false)}
          >
            <Camera size={16} /> 라이브 카메라
          </button>
          <button
            className={`mode-tab ${simMode ? 'active' : ''}`}
            onClick={() => setSimMode(true)}
          >
            <Zap size={16} /> QR 직접 테스트 (시뮬레이터)
          </button>
        </div>

        {!simMode ? (
          <div className="camera-box">
            <div id="qr-reader-region"></div>
            {scanError && <p className="scan-error-msg">{scanError}</p>}
          </div>
        ) : (
          <div className="simulator-box">
            <p className="sim-title">💡 테스트용 QR 코드를 선택해 빠르게 테스트해보세요:</p>

            <div className="sim-group">
              <h4>🏷️ 등록된 물품 QR 스캔 테스트:</h4>
              <div className="sim-buttons">
                {sampleItems.map((item) => (
                  <button
                    key={item.id}
                    className="sim-btn item-sim"
                    onClick={() =>
                      handleSimulateScan({
                        type: 'DALLAR_ITEM',
                        ...item
                      })
                    }
                  >
                    {item.icon} {item.name} ({item.price}D)
                  </button>
                ))}
              </div>
            </div>

            <div className="sim-group">
              <h4>💰 칭찬 포인트 지급 QR 스캔 테스트:</h4>
              <div className="sim-buttons">
                <button
                  className="sim-btn add-sim"
                  onClick={() =>
                    handleSimulateScan({
                      type: 'DALLAR_ADD',
                      points: 20,
                      label: '🌟 참 잘했어요 20D'
                    })
                  }
                >
                  ➕ 20 달란트 받기
                </button>
                <button
                  className="sim-btn add-sim"
                  onClick={() =>
                    handleSimulateScan({
                      type: 'DALLAR_ADD',
                      points: 50,
                      label: '🔥 대박 칭찬 50D'
                    })
                  }
                >
                  ➕ 50 달란트 받기
                </button>
              </div>
            </div>

            <div className="sim-group">
              <h4>🎡 Temu 룰렛 티켓 QR 스캔 테스트:</h4>
              <button
                className="sim-btn wheel-sim"
                onClick={() =>
                  handleSimulateScan({
                    type: 'DALLAR_WHEEL',
                    spins: 1,
                    label: '🎡 100% 당첨 룰렛 티켓'
                  })
                }
              >
                🎰 럭키 룰렛 티켓 스캔!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
