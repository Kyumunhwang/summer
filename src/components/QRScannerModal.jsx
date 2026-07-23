import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { playClickSound, playCoinSound, playErrorSound } from '../utils/sound';
import { parseQRData, getTeacherItems } from '../utils/storage';
import { Camera, X, Zap, RefreshCw } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanError, setScanError] = useState('');
  const [simMode, setSimMode] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const html5QrcodeRef = useRef(null);

  const startCamera = async () => {
    setScanError('');
    try {
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode('qr-reader-target');
      }

      const qrCodeSuccessCallback = (decodedText) => {
        playCoinSound();
        const parsed = parseQRData(decodedText);
        if (parsed) {
          stopCamera();
          onScanSuccess(parsed);
        } else {
          setScanError('인식할 수 없는 Stamp Market QR 코드입니다.');
          playErrorSound();
        }
      };

      const config = { fps: 10, qrbox: { width: 220, height: 220 } };

      // Try environment (back) camera first
      await html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // Frame error ignored
        }
      );
      setCameraStarted(true);
    } catch (err) {
      console.warn('FacingMode camera error, fallback to device list:', err);
      // Fallback: Get cameras list and try the first available camera
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const cameraId = devices[devices.length - 1].id; // usually back camera
          await html5QrcodeRef.current.start(
            cameraId,
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              playCoinSound();
              const parsed = parseQRData(decodedText);
              if (parsed) {
                stopCamera();
                onScanSuccess(parsed);
              }
            },
            () => {}
          );
          setCameraStarted(true);
        } else {
          setScanError('휴대폰 카메라를 찾을 수 없거나 브라우저 권한이 차단되었습니다.');
        }
      } catch (e2) {
        setScanError('카메라 접근 권한을 허용해 주세요. (또는 시뮬레이터 탭 사용)');
      }
    }
  };

  const stopCamera = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (e) {
        console.warn('Error stopping camera:', e);
      }
    }
    setCameraStarted(false);
  };

  useEffect(() => {
    if (isOpen && !simMode) {
      setTimeout(() => {
        startCamera();
      }, 300);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, simMode]);

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
          <div className="temu-badge-flash">📱 CAMERA SCANNER</div>
          <h2>STAMP SCANNER</h2>
          <p>선생님의 QR 코드를 카메라 화면 가운데에 맞춰주세요!</p>
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
            <Zap size={16} /> QR 수동 시뮬레이터
          </button>
        </div>

        {!simMode ? (
          <div className="camera-box">
            <div id="qr-reader-target" style={{ width: '100%', minHeight: '220px' }}></div>
            {scanError && (
              <div className="scan-error-box">
                <p className="scan-error-msg">{scanError}</p>
                <button className="retry-cam-btn" onClick={startCamera}>
                  <RefreshCw size={14} /> 카메라 다시 켜기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="simulator-box">
            <p className="sim-title">💡 테스트용 QR 코드를 선택해 바로 결제해 보세요:</p>

            <div className="sim-group">
              <h4>🏷️ 물품 QR 결제 테스트:</h4>
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
              <h4>💰 칭찬 포인트 QR 충전 테스트:</h4>
              <div className="sim-buttons">
                <button
                  className="sim-btn add-sim"
                  onClick={() => {
                    stopCamera();
                    onScanSuccess({
                      type: 'STAMP_ADD',
                      points: 20,
                      label: '🌟 20 스탬프 칭찬'
                    });
                  }}
                >
                  💰 칭찬 20 스탬프 지급
                </button>
                <button
                  className="sim-btn"
                  onClick={() => {
                    stopCamera();
                    onScanSuccess({
                      type: 'STAMP_ADD',
                      points: 50,
                      label: '🔥 50 스탬프 칭찬'
                    });
                  }}
                >
                  🔥 칭찬 50 스탬프 지급
                </button>
              </div>
            </div>

            <div className="sim-group">
              <h4>🎡 룰렛 티켓 QR 스캔 테스트:</h4>
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
                🎰 룰렛 티켓 스캔!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
