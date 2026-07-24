import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getStudentsList, saveStudentData } from '../utils/storage';
import { playClickSound, playCoinSound, playErrorSound } from '../utils/sound';
import { UserCheck, Key, User, ShieldCheck, Lock, Award, Sparkles, QrCode } from 'lucide-react';

export const MainLoginScreen = ({ onStudentLoginSuccess, onTeacherLoginSuccess }) => {
  const [students, setStudents] = useState(getStudentsList());
  const [selectedId, setSelectedId] = useState(students[0]?.id || 'student01');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Teacher Login State
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherPasswordInput, setTeacherPasswordInput] = useState('');
  const [teacherAuthError, setTeacherAuthError] = useState('');

  // Server URL Connection QR Modal State
  const [showServerQRModal, setShowServerQRModal] = useState(false);

  useEffect(() => {
    const freshList = getStudentsList();
    setStudents(freshList);
    if (!selectedId && freshList.length > 0) {
      setSelectedId(freshList[0].id);
    }
  }, []);

  const currentStudent = students.find((s) => s.id === selectedId) || students[0];

  const handleStudentLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const freshList = getStudentsList();
    const targetStudent = freshList.find((s) => s.id === selectedId) || currentStudent;

    const inputPwd = String(passwordInput).trim();
    const expectedPwd = String(targetStudent.password).trim();

    if (targetStudent && expectedPwd === inputPwd) {
      playCoinSound();
      saveStudentData(targetStudent);
      onStudentLoginSuccess(targetStudent);
    } else {
      playErrorSound();
      setLoginError('비밀번호(PIN)가 올바르지 않습니다.');
    }
  };

  const handleTeacherAuthSubmit = (e) => {
    e.preventDefault();
    setTeacherAuthError('');

    if (String(teacherPasswordInput).trim() === '0724') {
      playCoinSound();
      setShowTeacherAuthModal(false);
      setTeacherPasswordInput('');
      onTeacherLoginSuccess();
    } else {
      playErrorSound();
      setTeacherAuthError('선생님 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div
      className="main-login-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at top, #2C1654 0%, #0F0920 100%)',
        color: '#FFFFFF'
      }}
    >
      <div
        className="login-hero-card glow-temu animate-pop"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(25, 20, 45, 0.95)',
          border: '2px solid var(--temu-yellow)',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 12px 40px rgba(255, 199, 0, 0.25)',
          backdropFilter: 'blur(15px)',
          textAlign: 'center'
        }}
      >
        <div className="temu-header" style={{ marginBottom: '24px' }}>
          <div className="temu-badge-flash" style={{ display: 'inline-block', marginBottom: '8px' }}>
            ☀️ 2026 SUMMER SCHOOL
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--temu-yellow)', marginBottom: '8px' }}>
            STAMP MARKET
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#DDD', wordBreak: 'keep-all' }}>
            본인의 ID를 선택하고 4자리 비밀번호(PIN)를 입력해 지갑에 접속하세요!
          </p>
        </div>

        <form onSubmit={handleStudentLogin} className="item-form" style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--temu-yellow)', fontWeight: '800', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={16} /> 학생 선택 (ID & 이름)
            </label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setPasswordInput('');
                setLoginError('');
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid var(--temu-yellow)',
                fontSize: '1rem',
                fontWeight: '700'
              }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#18122B', color: 'white' }}>
                  {s.id} - {s.name} ({s.points} STAMP)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--temu-yellow)', fontWeight: '800', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Key size={16} /> 비밀번호 (PIN 번호)
            </label>
            <input
              type="password"
              placeholder="4자리 비밀번호 입력"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1.1rem',
                letterSpacing: '2px',
                textAlign: 'center'
              }}
            />
          </div>

          {loginError && (
            <p style={{ color: '#FF5555', fontSize: '0.85rem', textAlign: 'center', marginTop: '-10px', marginBottom: '14px', fontWeight: '700' }}>
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="add-submit-btn"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--gold-gradient)',
              color: '#111',
              fontSize: '1.1rem',
              fontWeight: '900',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(255, 199, 0, 0.4)'
            }}
          >
            <UserCheck size={20} /> 로그인 & 지갑 접속
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: '24px 0 16px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#19142D', padding: '0 10px', fontSize: '0.75rem', color: '#AAA' }}>
            관리자 전용
          </span>
        </div>

        {/* Teacher Mode Login Entry Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setShowTeacherAuthModal(true);
            setTeacherAuthError('');
            setTeacherPasswordInput('');
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px dashed var(--temu-yellow)',
            color: 'var(--temu-yellow)',
            fontSize: '0.95rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Award size={18} /> 👨‍🏫 선생님 모드 (TEACHER ADMIN) 입장
        </button>

        {/* Server Connection QR Code Modal Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setShowServerQRModal(true);
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid var(--temu-yellow)',
            color: 'var(--temu-yellow)',
            fontSize: '0.9rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <QrCode size={18} /> 📱 학생 접속용 QR 코드 (192.168.5.118)
        </button>
      </div>

      {/* Server Connection URL QR Code Modal */}
      {showServerQRModal && (
        <div className="modal-overlay" onClick={() => setShowServerQRModal(false)}>
          <div
            className="qr-display-card animate-pop"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '380px', padding: '24px', textAlign: 'center' }}
          >
            <button className="close-btn" onClick={() => setShowServerQRModal(false)}>
              ✕
            </button>
            <div className="qr-display-header">
              <span className="qr-big-icon" style={{ fontSize: '36px' }}>🌐</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--temu-yellow)' }}>
                학생 휴대폰 접속용 QR 코드
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#CCC', marginTop: '6px' }}>
                학생들이 휴대폰 카메라로 위 QR 코드를 스캔하면 바로 접속할 수 있습니다!
              </p>
            </div>

            <div className="qr-code-box" style={{ margin: '16px auto', padding: '16px', background: '#FFF', borderRadius: '16px', display: 'inline-block' }}>
              <QRCodeSVG
                value="https://192.168.5.118:5173/"
                size={220}
                bgColor={'#ffffff'}
                fgColor={'#111111'}
                level={'H'}
                includeMargin={true}
              />
            </div>

            <p style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--temu-yellow)', marginBottom: '16px' }}>
              https://192.168.5.118:5173/
            </p>

            <button
              className="claim-btn"
              onClick={() => setShowServerQRModal(false)}
              style={{ background: 'var(--temu-red)', color: 'white', margin: '0 auto' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Teacher Authentication Password Modal */}
      {showTeacherAuthModal && (
        <div className="modal-overlay" onClick={() => setShowTeacherAuthModal(false)}>
          <div
            className="student-login-card glow-temu animate-pop"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '380px' }}
          >
            <button
              className="close-btn"
              onClick={() => setShowTeacherAuthModal(false)}
            >
              ✕
            </button>

            <div className="temu-header" style={{ textAlign: 'center' }}>
              <div className="temu-badge-flash">👑 TEACHER ADMIN ACCESS</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900' }}>선생님 모드 비밀번호</h2>
              <p style={{ fontSize: '0.85rem', color: '#CCC' }}>
                선생님 전용 비밀번호(PIN)를 입력하세요.
              </p>
            </div>

            <form onSubmit={handleTeacherAuthSubmit} className="item-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={14} /> 선생님 비밀번호 (PIN)
                </label>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={teacherPasswordInput}
                  onChange={(e) => setTeacherPasswordInput(e.target.value)}
                  autoFocus
                  required
                  style={{
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    letterSpacing: '3px'
                  }}
                />
              </div>

              {teacherAuthError && (
                <p style={{ color: '#FF5555', fontSize: '0.8rem', textAlign: 'center', marginTop: '-6px', fontWeight: '700' }}>
                  {teacherAuthError}
                </p>
              )}

              <button
                type="submit"
                className="add-submit-btn"
                style={{ background: 'var(--temu-red)', color: 'white', marginTop: '10px' }}
              >
                <ShieldCheck size={18} /> 관리자 패널 입장
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
