import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { playClickSound, playCoinSound, playErrorSound } from '../utils/sound';
import { parseQRData, getTeacherItems } from '../utils/storage';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanError, setScanError] = useState('');
  const [simMode, setSimMode] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen || simMode) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, simMode]);

  const startCamera = async () => {
    setScanError('');
    setIsCameraStarting(true);

    try {
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode("qr-reader-region");
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1.0
      };

      // Start live camera with mobile rear camera preference
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // On QR Code Scan Success
          playCoinSound();
          const parsed = parseQRData(decodedText);
          if (parsed) {
            stopCamera();
            onScanSuccess(parsed);
          } else {
            setScanError('Dallar Market 공식 QR 코드가 아닙니다.');
            playErrorSound();
          }
        },
        (errorMessage) => {
          // Ignored non-scan frames
        }
      );

      setIsCameraStarting(false);
    } catch (err) {
      console.error('Camera start failed:', err);
      setIsCameraStarting(false);
      setScanError('카메라 접근 승인이 필요합니다. 브라우저 카메라 권한 허용을 클릭해 주세요.');
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Camera stop error:', e);
      }
      html5QrCodeRef.current = null;
    }
  };

  if (!isOpen) return null;

  const sampleItems = getTeacherItems();

  const handleSimulateScan = (qrObject) => {
    playClickSound();
    playCoinSound();
    stopCamera();
    onScanSuccess(qrObject);
  };

  return (
    <div className="modal-overlay">
      <div className="qr-modal-card glow-temu">
        <button
          className="close-btn"
          onClick={() => {
            playClickSound();
            stopCamera();
            onClose();
          }}
        >
          <X size={24} />
        </button>

        <div className="temu-header">
          <div className="temu-badge-flash">📷 LIVE QR CAMERA</div>
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
            <div id="qr-reader-region" style={{ width: '100%', minHeight: '280px' }}></div>

            {isCameraStarting && (
              <p className="cam-loading-msg">📷 라이브 카메라 준비 중...</p>
            )}

            {scanError && (
              <div className="scan-error-card">
                <p className="scan-error-msg">{scanError}</p>
                <button className="retry-cam-btn" onClick={startCamera}>
                  <RefreshCw size={16} /> 카메라 다시 켜기
                </button>
              </div>
            )}
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
