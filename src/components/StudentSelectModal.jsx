import React, { useState, useEffect } from 'react';
import { getStudentsList, saveStudentData } from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { UserCheck, X, Key, User } from 'lucide-react';

export const StudentSelectModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [students, setStudents] = useState(getStudentsList());
  const [selectedId, setSelectedId] = useState(students[0]?.id || 'student01');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const freshList = getStudentsList();
      setStudents(freshList);
      if (!selectedId && freshList.length > 0) {
        setSelectedId(freshList[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedId) || students[0];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Fetch fresh master list to ensure absolute accuracy
    const freshList = getStudentsList();
    const targetStudent = freshList.find((s) => s.id === selectedId) || currentStudent;

    const inputPwd = String(passwordInput).trim();
    const expectedPwd = String(targetStudent.password).trim();

    if (targetStudent && expectedPwd === inputPwd) {
      playCoinSound();
      saveStudentData(targetStudent);
      onLoginSuccess(targetStudent);
      onClose();
    } else {
      setLoginError(`비밀번호(PIN)가 올바르지 않습니다.`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="student-login-card glow-temu animate-pop">
        <button className="close-btn" onClick={() => { playClickSound(); onClose(); }}>
          <X size={24} />
        </button>

        <div className="temu-header">
          <div className="temu-badge-flash">👨‍🎓 STUDENT LOGIN</div>
          <h2>학생 로그인</h2>
          <p>본인의 ID와 비밀번호(PIN)를 입력해 지갑에 접속하세요!</p>
        </div>

        <form onSubmit={handleLogin} className="item-form">
          <div className="form-group">
            <label><User size={14} /> 학생 선택 (ID & 이름)</label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setPasswordInput('');
                setLoginError('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid var(--temu-yellow)',
                fontSize: '0.95rem'
              }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#111', color: 'white' }}>
                  {s.id} - {s.name} ({s.points} STAMP)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><Key size={14} /> 비밀번호 (PIN 번호)</label>
            <input
              type="password"
              placeholder={`예: ${currentStudent?.password || '1001'}`}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>

          {loginError && (
            <p style={{ color: '#FF5555', fontSize: '0.8rem', textAlign: 'center', marginTop: '-6px' }}>
              {loginError}
            </p>
          )}

          <button type="submit" className="add-submit-btn" style={{ background: 'var(--gold-gradient)' }}>
            <UserCheck size={18} /> 로그인 & 지갑 접속
          </button>
        </form>
      </div>
    </div>
  );
};
