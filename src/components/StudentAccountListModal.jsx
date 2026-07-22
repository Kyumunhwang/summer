import React, { useState, useEffect } from 'react';
import { getAllStudents, saveAllStudents, syncAllStudents } from '../utils/storage';
import { playClickSound, playCoinSound } from '../utils/sound';
import { Users, Search, Eye, EyeOff, X, Trash2, Edit3, Check, RefreshCw } from 'lucide-react';

export const StudentAccountListModal = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState(getAllStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editPoints, setEditPoints] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStudents(getAllStudents());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStudents = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteStudent = (id) => {
    if (window.confirm(`정말로 ID [${id}] 학생 계정을 삭제하시겠습니까?`)) {
      playClickSound();
      const updated = students.filter(s => s.id !== id);
      saveAllStudents(updated);
      setStudents(updated);
    }
  };

  const handleStartEditPoints = (student) => {
    setEditingStudentId(student.id);
    setEditPoints(student.points);
  };

  const handleSaveEditPoints = (id) => {
    playClickSound();
    const updated = students.map(s => {
      if (s.id === id) {
        return { ...s, points: Math.max(0, parseInt(editPoints, 10) || 0) };
      }
      return s;
    });
    saveAllStudents(updated);
    setStudents(updated);
    setEditingStudentId(null);
  };

  const handleSyncStudents = () => {
    playCoinSound();
    const synced = syncAllStudents();
    setStudents(synced);
    alert(`🎉 학생 명단 및 비밀번호 정보가 완벽하게 동기화되었습니다! (총 ${synced.length}명)`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content student-accounts-modal animate-pop" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="modal-header-box">
          <div className="m-title">
            <Users size={26} className="text-gold" />
            <div>
              <h2>👥 가입된 학생 계정 및 비밀번호 목록</h2>
              <p>총 {students.length}명의 학생 지갑 계정과 등록 비밀번호를 조회/관리합니다.</p>
            </div>
          </div>

          <div className="m-actions">
            <button
              className="toggle-pw-btn"
              onClick={handleSyncStudents}
              style={{ background: 'rgba(0, 204, 255, 0.15)', borderColor: '#00CCFF', color: '#00CCFF' }}
            >
              <RefreshCw size={16} /> 🔄 학생 명단 즉시 동기화
            </button>

            <button
              className="toggle-pw-btn"
              onClick={() => { playClickSound(); setShowPasswords(!showPasswords); }}
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showPasswords ? '비밀번호 숨기기' : '비밀번호 표시'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="학생 이름 또는 ID로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Account Table */}
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>학생 ID</th>
                <th>이름</th>
                <th>비밀번호</th>
                <th>보유 달란트</th>
                <th>룰렛 기회</th>
                <th>럭키박스 기회</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    검색 결과가 없거나 등록된 학생이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id}>
                    <td><strong className="id-badge">{s.id}</strong></td>
                    <td><strong>{s.name}</strong></td>
                    <td>
                      <span className="pw-text">
                        {showPasswords ? (s.password || '1234') : '••••'}
                      </span>
                    </td>
                    <td>
                      {editingStudentId === s.id ? (
                        <div className="edit-points-inline">
                          <input
                            type="number"
                            value={editPoints}
                            onChange={e => setEditPoints(e.target.value)}
                            className="points-input"
                          />
                          <button className="icon-save-btn" onClick={() => handleSaveEditPoints(s.id)}>
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="points-view-inline">
                          <span className="gold-badge">{s.points ?? 0} D</span>
                          <button className="icon-edit-btn" onClick={() => handleStartEditPoints(s)}>
                            <Edit3 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{s.spinsLeft ?? 1}회</td>
                    <td>{s.luckyBoxSpinsLeft ?? 1}회</td>
                    <td>
                      <button className="table-del-btn" onClick={() => handleDeleteStudent(s.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
