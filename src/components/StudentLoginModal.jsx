import React, { useState } from 'react';
import { loginStudent } from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { UserCheck, Lock, LogIn, Award } from 'lucide-react';

export const StudentLoginModal = ({ onLoginSuccess, onSwitchToTeacher }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentId) {
      setErrorMsg('학생 ID를 입력하세요.');
      return;
    }

    playClickSound();
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
        {/* Teacher Mode Direct Switch Button */}
        <div className="login-top-bar">
          <button
            type="button"
            className="teacher-login-switch-btn"
            onClick={() => { playClickSound(); onSwitchToTeacher(); }}
          >
            <Award size={16} /> 🏆 선생님 관리자 모드 이동
          </button>
        </div>

        <div className="login-header">
          <span className="login-icon">🦁</span>
          <h2>2026 Summer School 지갑 로그인</h2>
          <p>선생님이 부여한 <strong>학생 ID</strong>와 <strong>비밀번호</strong>를 입력하세요!</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label><UserCheck size={16} /> 학생 ID</label>
            <input
              type="text"
              placeholder="예: std_01 또는 std_06"
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> 비밀번호 4자리</label>
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
