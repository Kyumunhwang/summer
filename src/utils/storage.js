// LocalStorage & Multi-Student Auth & Data Management Engine

const CURRENT_USER_ID_KEY = 'DALLAR_CURRENT_USER_ID_V3';
const STUDENTS_STORAGE_KEY = 'DALLAR_STUDENTS_LIST_V10';
const TEACHER_ITEMS_KEY = 'DALLAR_MARKET_ITEMS_V14'; // V14: Real Teacher Items Sync (맛있는 슬러시, 펜, 노트, 지우개...)
const HISTORY_STORAGE_KEY = 'DALLAR_MARKET_HISTORY_V4';
const GAME_CONFIG_KEY = 'DALLAR_GAME_CONFIG_V5';

// Helper to strip emoji icons from item names
export const cleanItemName = (name) => {
  if (!name) return '';
  return name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
};

const DEFAULT_GAME_CONFIG = {
  isWheelEnabled: true,
  isLuckyBoxEnabled: true
};

export const getGameConfig = () => {
  const data = localStorage.getItem(GAME_CONFIG_KEY);
  if (!data) {
    localStorage.setItem(GAME_CONFIG_KEY, JSON.stringify(DEFAULT_GAME_CONFIG));
    return DEFAULT_GAME_CONFIG;
  }
  try {
    const parsed = JSON.parse(data);
    return {
      isWheelEnabled: parsed.isWheelEnabled !== false,
      isLuckyBoxEnabled: parsed.isLuckyBoxEnabled !== false
    };
  } catch (e) {
    return DEFAULT_GAME_CONFIG;
  }
};

export const resetAllStudentsWheelSpins = () => {
  const students = getAllStudents();
  const updated = students.map(s => ({
    ...s,
    spinsLeft: 1
  }));
  saveAllStudents(updated);
};

export const resetAllStudentsLuckyBoxSpins = () => {
  const students = getAllStudents();
  const updated = students.map(s => ({
    ...s,
    luckyBoxSpinsLeft: 1
  }));
  saveAllStudents(updated);
};

export const updateGameConfig = (newConfig) => {
  const current = getGameConfig();
  const updated = { ...current, ...newConfig };
  localStorage.setItem(GAME_CONFIG_KEY, JSON.stringify(updated));

  if (newConfig.isWheelEnabled === true) {
    resetAllStudentsWheelSpins();
  }
  if (newConfig.isLuckyBoxEnabled === true) {
    resetAllStudentsLuckyBoxSpins();
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dallarGameConfigChanged', { detail: updated }));
  }
  return updated;
};

// QR Protocol for Game Ticket Add & Control Sync
export const encodeGameTicketQR = (gameKey) => {
  return JSON.stringify({
    type: 'DALLAR_GAME_TICKET_ADD',
    gameKey: gameKey,
    count: 1
  });
};

export const encodeGameControlQR = (gameKey, enable) => {
  return JSON.stringify({
    type: 'DALLAR_GAME_CONTROL',
    gameKey: gameKey,
    enable: Boolean(enable)
  });
};

// Updated 31 Student Accounts
const DEFAULT_STUDENTS = [
  { id: 'std_01', name: '황규문', password: '5816', points: 10000, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_06', name: '최승재', password: '4558', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_07', name: '한예나', password: '5408', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_08', name: '강세찬', password: '7075', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_09', name: '이지율', password: '9394', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_10', name: '이이든', password: '8113', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_11', name: '이이든', password: '7422', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_12', name: '이시우', password: '8602', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_13', name: '이태이', password: '3692', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_14', name: '오평안', password: '5183', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_15', name: '강동호', password: '3609', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_16', name: '김다연', password: '2125', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_17', name: '김이건', password: '3031', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_18', name: '이상우', password: '7723', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_19', name: '박하빈', password: '7159', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_20', name: '유하연', password: '8477', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_21', name: '양시온', password: '3918', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_22', name: '윤라엘', password: '2051', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_23', name: '윤건우', password: '3455', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_24', name: '정라온', password: '6024', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_25', name: '오시온', password: '1445', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_26', name: '박하온', password: '2860', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_27', name: '신하준', password: '3767', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_28', name: '송상윤', password: '4224', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_29', name: '유하준', password: '2494', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_30', name: '윤석현', password: '6874', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_31', name: '김형서', password: '4078', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_32', name: '김리원', password: '1484', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_33', name: '이지민', password: '4028', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_34', name: '이희엘', password: '5587', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 },
  { id: 'std_35', name: '송유빈', password: '8202', points: 100, spinsLeft: 1, luckyBoxSpinsLeft: 1, totalSpins: 0 }
];

import { pushItemsToBackend, pushStudentsToBackend } from './api';

// Exact Real Teacher Items List From Computer Dashboard
let DEFAULT_ITEMS = [
  { id: 'item_1', name: '맛있는 슬러시', price: 10, stock: 20, category: '음료', badge: 'HOT', description: '시원하다. 시원해....' },
  { id: 'item_2', name: '펜', price: 10, stock: 100, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' },
  { id: 'item_3', name: '노트', price: 10, stock: 200, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' },
  { id: 'item_4', name: '지우개', price: 10, stock: 300, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' },
  { id: 'item_5', name: '펜2', price: 20, stock: 100, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' },
  { id: 'item_6', name: '노트2', price: 20, stock: 200, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' },
  { id: 'item_7', name: '지우개2', price: 20, stock: 300, category: '문구', badge: 'BEST', description: '예쁜 캐릭터 볼펜과 노트' }
];

// --- Students Accounts Management ---
export const getAllStudents = () => {
  const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
  if (!data) {
    saveAllStudents(DEFAULT_STUDENTS);
    return DEFAULT_STUDENTS;
  }
  try {
    const list = JSON.parse(data);
    return list.map(s => ({
      ...s,
      spinsLeft: s.spinsLeft !== undefined ? s.spinsLeft : 1,
      luckyBoxSpinsLeft: s.luckyBoxSpinsLeft !== undefined ? s.luckyBoxSpinsLeft : 1
    }));
  } catch (e) {
    saveAllStudents(DEFAULT_STUDENTS);
    return DEFAULT_STUDENTS;
  }
};

export const saveAllStudents = (students) => {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dallarStudentsChanged', { detail: students }));
  }
  // Async Push to FastAPI Backend for 0.01s Realtime Multi-Device Push Broadcast
  pushStudentsToBackend(students);
};


export const syncAllStudents = () => {
  saveAllStudents(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
};

export const getCurrentStudentId = () => {
  return localStorage.getItem(CURRENT_USER_ID_KEY) || null;
};

export const setCurrentStudentId = (id) => {
  if (id) {
    localStorage.setItem(CURRENT_USER_ID_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
};

// Strict Login Function: Strictly requires Student ID and Password matching
export const loginStudent = (idInput, passwordInput) => {
  const students = getAllStudents();
  const cleanId = String(idInput || '').trim().toLowerCase();
  const cleanPw = String(passwordInput || '').trim();

  const found = students.find(s => {
    const sId = String(s.id || '').trim().toLowerCase();
    const sPw = String(s.password || '').trim();

    return sId === cleanId && sPw === cleanPw;
  });

  if (found) {
    setCurrentStudentId(found.id);
    return { success: true, student: found };
  }
  return { success: false, message: '학생 ID와 비밀번호를 확인해주세요.' };
};

export const logoutStudent = () => {
  setCurrentStudentId(null);
};

export const getStudentData = () => {
  const currentId = getCurrentStudentId();
  const students = getAllStudents();
  if (!currentId) return null;

  const found = students.find(s => s.id === currentId);
  if (!found) return null;

  return {
    ...found,
    spinsLeft: found.spinsLeft !== undefined ? found.spinsLeft : 1,
    luckyBoxSpinsLeft: found.luckyBoxSpinsLeft !== undefined ? found.luckyBoxSpinsLeft : 1
  };
};

export const saveStudentData = (updatedStudent) => {
  const students = getAllStudents();
  const updatedList = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
  saveAllStudents(updatedList);
};

export const updateStudentPoints = (amount) => {
  const student = getStudentData();
  if (!student) return 0;

  student.points = Math.max(0, student.points + amount);
  saveStudentData(student);
  return student.points;
};

export const addStudentSpins = (count) => {
  const student = getStudentData();
  if (!student) return 0;

  student.spinsLeft = Math.max(0, (student.spinsLeft !== undefined ? student.spinsLeft : 1) + count);
  if (count < 0) {
    student.totalSpins = (student.totalSpins || 0) + Math.abs(count);
  }
  saveStudentData(student);
  return student.spinsLeft;
};

export const addStudentLuckyBoxSpins = (count) => {
  const student = getStudentData();
  if (!student) return 0;

  student.luckyBoxSpinsLeft = Math.max(0, (student.luckyBoxSpinsLeft !== undefined ? student.luckyBoxSpinsLeft : 1) + count);
  saveStudentData(student);
  return student.luckyBoxSpinsLeft;
};

// --- Teacher Items Storage ---
export const getTeacherItems = () => {
  const data = localStorage.getItem(TEACHER_ITEMS_KEY);
  if (!data) {
    saveTeacherItems(DEFAULT_ITEMS);
    return DEFAULT_ITEMS;
  }
  try {
    const list = JSON.parse(data);
    const itemMap = new Map();

    list.forEach(i => {
      if (i && i.id) {
        itemMap.set(String(i.id).trim(), i);
      }
    });

    // Smart merge newly uploaded items from DEFAULT_ITEMS
    let hasNewDefaults = false;
    DEFAULT_ITEMS.forEach(def => {
      const idKey = String(def.id).trim();
      if (!itemMap.has(idKey)) {
        itemMap.set(idKey, def);
        hasNewDefaults = true;
      }
    });

    const filtered = Array.from(itemMap.values()).filter(i => {
      const n = cleanItemName(i.name);
      return n !== '상품5' && n !== '상품8' && n !== '상품9' && n !== '상품 5' && n !== '상품 8' && n !== '상품 9';
    }).map(item => ({
      ...item,
      name: cleanItemName(item.name)
    }));

    if (hasNewDefaults || filtered.length !== list.length) {
      saveTeacherItems(filtered);
    }
    return filtered;
  } catch (e) {
    saveTeacherItems(DEFAULT_ITEMS);
    return DEFAULT_ITEMS;
  }
};

export const saveTeacherItems = (items) => {
  const cleanedItems = items.filter(i => {
    const n = cleanItemName(i.name);
    return n !== '상품5' && n !== '상품8' && n !== '상품9' && n !== '상품 5' && n !== '상품 8' && n !== '상품 9';
  }).map(item => ({
    ...item,
    name: cleanItemName(item.name)
  }));

  DEFAULT_ITEMS = cleanedItems;
  localStorage.setItem(TEACHER_ITEMS_KEY, JSON.stringify(cleanedItems));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dallarItemsChanged', { detail: cleanedItems }));
  }
  // Async Push to FastAPI Backend for 0.01s Realtime Multi-Device Push Broadcast
  pushItemsToBackend(cleanedItems);
};


// Force Sync Master 7 Real Teacher Items Across Mobile & Computer Devices
export const syncTeacherItems = () => {
  const currentItems = getTeacherItems();
  saveTeacherItems(currentItems);
  return currentItems;
};


export const addTeacherItem = (newItem) => {
  const items = getTeacherItems();
  const itemToAdd = {
    id: 'item_' + Date.now(),
    name: cleanItemName(newItem.name),
    price: parseInt(newItem.price, 10),
    stock: parseInt(newItem.stock || 20, 10),
    category: newItem.category || '기타',
    badge: newItem.badge || 'NEW',
    description: newItem.description || ''
  };
  const updated = [itemToAdd, ...items];
  saveTeacherItems(updated);
  return updated;
};

export const deductItemStock = (id) => {
  const items = getTeacherItems();
  const updated = items.map(item => {
    if (String(item.id).trim() === String(id).trim()) {
      return { ...item, stock: Math.max(0, (item.stock || 1) - 1) };
    }
    return item;
  });
  saveTeacherItems(updated);
  return updated;
};

export const deleteTeacherItem = (id) => {
  const items = getTeacherItems();
  const targetId = String(id).trim();
  const updated = items.filter(item => String(item.id).trim() !== targetId);
  saveTeacherItems(updated);
  return updated;
};

// --- History Storage ---
export const getPurchaseHistory = (studentId = null) => {
  const data = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!data) return [];
  try {
    const history = JSON.parse(data);
    const targetId = studentId || getCurrentStudentId();
    if (targetId) {
      return history.filter(h => h.studentId === targetId).map(h => ({
        ...h,
        name: cleanItemName(h.name)
      }));
    }
    return history.map(h => ({
      ...h,
      name: cleanItemName(h.name)
    }));
  } catch (e) {
    return [];
  }
};

export const addPurchaseRecord = (record) => {
  const data = localStorage.getItem(HISTORY_STORAGE_KEY);
  let history = [];
  try {
    if (data) history = JSON.parse(data);
  } catch (e) { history = []; }

  const currentStudent = getStudentData();
  const newRecord = {
    name: cleanItemName(record.name),
    price: record.price,
    studentId: currentStudent ? currentStudent.id : 'unknown',
    studentName: currentStudent ? currentStudent.name : '알수없음',
    timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  const updated = [newRecord, ...history];
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dallarHistoryChanged', { detail: updated }));
  }
  return updated;
};


export const resetAllData = () => {
  localStorage.removeItem(CURRENT_USER_ID_KEY);
  localStorage.removeItem(STUDENTS_STORAGE_KEY);
  localStorage.removeItem(TEACHER_ITEMS_KEY);
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  localStorage.removeItem(GAME_CONFIG_KEY);
  getAllStudents();
  getTeacherItems();
  getGameConfig();
};

// Smart CSV & Tab-delimited Item Parser
export const parseCSVToItems = (csvText) => {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const items = [];
  let startIdx = 0;
  const firstLineLower = lines[0].toLowerCase();
  if (
    firstLineLower.includes('id') ||
    firstLineLower.includes('name') ||
    firstLineLower.includes('price') ||
    firstLineLower.includes('stock')
  ) {
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    let tokens = [];
    if (rawLine.includes('\t')) {
      tokens = rawLine.split('\t');
    } else {
      tokens = rawLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    }

    const cleanValues = tokens.map(v => v.trim().replace(/^"|"$/g, ''));
    if (cleanValues.length === 0 || !cleanValues[0]) continue;

    const item = {
      id: cleanValues[0] || ('item_' + Date.now() + '_' + i),
      name: cleanItemName(cleanValues[1] || ('상품 ' + i)),
      price: parseInt(cleanValues[2], 10) || 10,
      stock: parseInt(cleanValues[3], 10) || 20,
      category: cleanValues[4] || '기타',
      badge: cleanValues[5] || 'NEW',
      description: cleanValues[6] || ''
    };
    items.push(item);
  }

  if (items.length > 0) {
    saveTeacherItems(items);
  }
  return items;
};

// Smart CSV & Tab-delimited (Google Sheet / Excel Copy-Paste) Parser
export const parseCSVToStudents = (csvText) => {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const studentMap = new Map();
  const existingStudents = getAllStudents();
  existingStudents.forEach(s => {
    if (s && s.id) {
      studentMap.set(String(s.id).trim().toLowerCase(), s);
    }
  });

  // Check if first line is a header
  let startIdx = 0;
  const firstLineLower = lines[0].toLowerCase();
  if (
    firstLineLower.includes('id') ||
    firstLineLower.includes('name') ||
    firstLineLower.includes('password') ||
    firstLineLower.includes('points')
  ) {
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Detect delimiter: tab (\t) or comma (,)
    let tokens = [];
    if (rawLine.includes('\t')) {
      tokens = rawLine.split('\t');
    } else {
      tokens = rawLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    }

    const cleanValues = tokens.map(v => v.trim().replace(/^"|"$/g, ''));
    if (cleanValues.length === 0 || !cleanValues[0]) continue;

    const id = cleanValues[0];
    const name = cleanValues[1] || id;
    const password = cleanValues[2] !== undefined && cleanValues[2] !== '' ? String(cleanValues[2]).trim() : '1234';
    const points = parseInt(cleanValues[3], 10);
    const spinsLeft = parseInt(cleanValues[4], 10);

    const mapKey = id.trim().toLowerCase();
    const existing = studentMap.get(mapKey) || {};

    const studentObj = {
      ...existing,
      id: id.trim(),
      name: name.trim(),
      password: password,
      points: !isNaN(points) ? points : (existing.points !== undefined ? existing.points : 100),
      spinsLeft: !isNaN(spinsLeft) ? spinsLeft : 1,
      luckyBoxSpinsLeft: 1,
      totalSpins: existing.totalSpins || 0
    };

    studentMap.set(mapKey, studentObj);
  }

  const updatedStudents = Array.from(studentMap.values());
  saveAllStudents(updatedStudents);
  return updatedStudents;
};

// Export Students CSV File Format: id,name,password,points,spinsLeft
export const exportStudentsToCSV = (students) => {
  const header = 'id,name,password,points,spinsLeft\n';
  const rows = students.map(s =>
    `"${s.id}","${s.name}","${s.password}",${s.points},${s.spinsLeft || 1}`
  ).join('\n');
  return header + rows;
};

// Export CSV File Format: id,name,price,stock,category,badge,description
export const exportItemsToCSV = (items) => {
  const header = 'id,name,price,stock,category,badge,description\n';
  const rows = items.map(i =>
    `"${i.id}","${cleanItemName(i.name)}",${i.price},${i.stock},"${i.category}","${i.badge}","${i.description}"`
  ).join('\n');
  return header + rows;
};

// Lightweight Compact QR Protocol Encoder for items (Prevents QR overflow)
export const encodeAllItemsQR = () => {
  const items = getTeacherItems();
  // Compact representation: [id, name, price, stock]
  const compactList = items.map(i => [
    i.id,
    cleanItemName(i.name),
    i.price,
    i.stock ?? 20
  ]);
  return JSON.stringify({
    type: 'DALLAR_ITEMS_COMPACT',
    d: compactList
  });
};

export const encodeItemQR = (item) => {
  return JSON.stringify({
    type: 'DALLAR_ITEM',
    id: item.id,
    name: cleanItemName(item.name),
    price: item.price
  });
};

export const encodePointQR = (points, label = '칭찬 포인트') => {
  return JSON.stringify({
    type: 'DALLAR_ADD',
    points: parseInt(points, 10),
    label: label
  });
};

export const encodeWheelQR = (spins = 1) => {
  return JSON.stringify({
    type: 'DALLAR_WHEEL',
    spins: parseInt(spins, 10),
    label: 'Temu 럭키 룰렛 티켓'
  });
};

export const parseQRData = (rawText) => {
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && parsed.type) {
      if (parsed.name) parsed.name = cleanItemName(parsed.name);
      return parsed;
    }
  } catch (e) {
    if (rawText.startsWith('DALLAR_ITEM:')) {
      const id = rawText.replace('DALLAR_ITEM:', '');
      const items = getTeacherItems();
      const item = items.find(i => i.id === id);
      if (item) return { type: 'DALLAR_ITEM', ...item, name: cleanItemName(item.name) };
    } else if (rawText.startsWith('DALLAR_ADD:')) {
      const pts = parseInt(rawText.replace('DALLAR_ADD:', ''), 10);
      return { type: 'DALLAR_ADD', points: pts, label: '칭찬 달란트' };
    } else if (rawText.startsWith('DALLAR_WHEEL:')) {
      const spins = parseInt(rawText.replace('DALLAR_WHEEL:', ''), 10) || 1;
      return { type: 'DALLAR_WHEEL', spins: spins, label: '럭키 룰렛 티켓' };
    }
  }
  return null;
};
