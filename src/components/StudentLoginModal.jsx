import React, { useState } from 'react';
import { loginStudent } from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { UserCheck, Lock, LogIn } from 'lucide-react';

export const StudentLoginModal = ({ onLoginSuccess, onSwitchToTeacher }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentId) {
      setErrorMsg('ID를 입력하세요.');
      return;
    }

    playClickSound();

    // 🛡️ A안 보안 관리자 로그인 인터셉트: ID admin / Password 2701
    const cleanId = String(studentId).trim().toLowerCase();
    const cleanPw = String(password).trim();

    if (cleanId === 'admin') {
      if (cleanPw === '2701') {
        playCoinSound();
        setErrorMsg('');
        if (onSwitchToTeacher) {
          onSwitchToTeacher();
        }
        return;
      } else {
        setErrorMsg('비밀번호가 올바르지 않습니다.');
        return;
      }
    }

    // 일반 학생 로그인 처리
    const result = loginStudent(studentId, password);
    if (result.success) {
      playCoinSound();
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card animate-pop">
        <div className="login-header">
          <span className="login-icon">🦁</span>
          <h2>2026 Summer School 지갑 로그인</h2>
          <p>부여받은 <strong>ID</strong>와 <strong>비밀번호</strong>를 입력하세요!</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label><UserCheck size={16} /> ID</label>
            <input
              type="text"
              placeholder="예: std_01"
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> 비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          {errorMsg && <div className="login-error-msg">{errorMsg}</div>}

          <button type="submit" className="login-submit-btn">
            <LogIn size={20} /> 지갑 접속하기
          </button>
        </form>
      </div>
    </div>
  );
};
