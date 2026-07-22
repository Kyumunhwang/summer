// LocalStorage & QR Code Data Management for Standalone Web

const STUDENT_STORAGE_KEY = 'DALLAR_MARKET_STUDENT_V1';
const TEACHER_ITEMS_KEY = 'DALLAR_MARKET_ITEMS_V1';
const HISTORY_STORAGE_KEY = 'DALLAR_MARKET_HISTORY_V1';

// Default Sample Items created for Summer School Funday
const DEFAULT_ITEMS = [
  {
    id: 'item_1',
    name: '🍦 프리미엄 아이스크림',
    price: 10,
    stock: 30,
    category: '간식',
    badge: 'HOT',
    icon: '🍨',
    description: '달콤 시원한 여름 꿀맛 아이스크림'
  },
  {
    id: 'item_2',
    name: '🥤 시원한 과일 에이드',
    price: 15,
    stock: 25,
    category: '음료',
    badge: 'POPULAR',
    icon: '🍹',
    description: '톡 쏘는 상큼한 과일 에이드'
  },
  {
    id: 'item_3',
    name: '🎁 럭키 장난감 세트',
    price: 30,
    stock: 15,
    category: '선물',
    badge: 'RARE',
    icon: '🧸',
    description: '인기 폭발 럭키 장난감'
  },
  {
    id: 'item_4',
    name: '✏️ 스페셜 캐릭터 문구 세트',
    price: 25,
    stock: 20,
    category: '문구',
    badge: 'BEST',
    icon: '🎨',
    description: '예쁜 캐릭터 볼펜과 노트'
  },
  {
    id: 'item_5',
    name: '🍿 팝콘 & 츄러스 콤보',
    price: 20,
    stock: 40,
    category: '간식',
    badge: 'DELICIOUS',
    icon: '🍿',
    description: '갓 튀겨 고소한 팝콘 콤보'
  },
  {
    id: 'item_6',
    name: '🎟️ 선생님과의 VIP 스페셜 쿠폰',
    price: 50,
    stock: 5,
    category: '쿠폰',
    badge: 'LEGEND',
    icon: '👑',
    description: '자리 지정권 / 게임 우선권 특별 쿠폰'
  }
];

const DEFAULT_STUDENT = {
  name: '여름방학 알뜰이',
  points: 120, // Default starting points
  spinsLeft: 2, // Temu Lucky Spins left
  badges: ['🌟 썸머스쿨 참가자', '🎯 첫 걸음'],
  avatar: '🦁'
};

// --- Student Storage ---
export const getStudentData = () => {
  const data = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!data) {
    saveStudentData(DEFAULT_STUDENT);
    return DEFAULT_STUDENT;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_STUDENT;
  }
};

export const saveStudentData = (student) => {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
};

export const updateStudentPoints = (amount) => {
  const student = getStudentData();
  student.points = Math.max(0, student.points + amount);
  saveStudentData(student);
  return student.points;
};

export const addStudentSpins = (count) => {
  const student = getStudentData();
  student.spinsLeft = (student.spinsLeft || 0) + count;
  saveStudentData(student);
  return student.spinsLeft;
};

// --- Teacher Items Storage ---
export const getTeacherItems = () => {
  const data = localStorage.getItem(TEACHER_ITEMS_KEY);
  if (!data) {
    saveTeacherItems(DEFAULT_ITEMS);
    return DEFAULT_ITEMS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_ITEMS;
  }
};

export const saveTeacherItems = (items) => {
  localStorage.setItem(TEACHER_ITEMS_KEY, JSON.stringify(items));
};

export const addTeacherItem = (newItem) => {
  const items = getTeacherItems();
  const itemToAdd = {
    ...newItem,
    id: 'item_' + Date.now()
  };
  const updated = [itemToAdd, ...items];
  saveTeacherItems(updated);
  return updated;
};

export const deleteTeacherItem = (id) => {
  const items = getTeacherItems();
  const updated = items.filter(item => item.id !== id);
  saveTeacherItems(updated);
  return updated;
};

// --- History Storage ---
export const getPurchaseHistory = () => {
  const data = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const addPurchaseRecord = (record) => {
  const history = getPurchaseHistory();
  const newRecord = {
    ...record,
    timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  const updated = [newRecord, ...history];
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resetAllData = () => {
  localStorage.removeItem(STUDENT_STORAGE_KEY);
  localStorage.removeItem(TEACHER_ITEMS_KEY);
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  getStudentData();
  getTeacherItems();
};

// --- QR Protocol Encoder & Decoder ---
export const encodeItemQR = (item) => {
  return JSON.stringify({
    type: 'DALLAR_ITEM',
    id: item.id,
    name: item.name,
    price: item.price,
    icon: item.icon || '🎁'
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
      return parsed;
    }
  } catch (e) {
    // Fallback for simple legacy text format
    if (rawText.startsWith('DALLAR_ITEM:')) {
      const id = rawText.replace('DALLAR_ITEM:', '');
      const items = getTeacherItems();
      const item = items.find(i => i.id === id);
      if (item) {
        return { type: 'DALLAR_ITEM', ...item };
      }
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
