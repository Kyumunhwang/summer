// LocalStorage & QR Code Data Management for Standalone Web

const STUDENT_STORAGE_KEY = 'STAMP_MARKET_STUDENT_V1';
const TEACHER_ITEMS_KEY = 'STAMP_MARKET_ITEMS_V5';
const HISTORY_STORAGE_KEY = 'STAMP_MARKET_HISTORY_V1';

// Default Sample Items created for Summer School Funday (Name, Price, Stock Only)
const DEFAULT_ITEMS = [
  {
    id: 'item_1',
    name: '과자',
    price: 25,
    stock: 99
  },
  {
    id: 'item_2',
    name: '샤프',
    price: 40,
    stock: 12
  },
  {
    id: 'item_3',
    name: '소세지',
    price: 15,
    stock: 66
  },
  {
    id: 'item_4',
    name: '젤리',
    price: 15,
    stock: 30
  },
  {
    id: 'item_5',
    name: '음료수',
    price: 20,
    stock: 24
  },
  {
    id: 'item_6',
    name: '노트',
    price: 40,
    stock: 12
  },
  {
    id: 'item_7',
    name: '문화상품권(경매)',
    price: 150,
    stock: 2
  }
];

const DEFAULT_STUDENT = {
  name: '여름방학 알뜰이',
  points: 100, // Default starting points
  spinsLeft: 0, // Temu Lucky Spins left (Requires Teacher Approval)
  boxesLeft: 0, // Lucky Box Gacha left (Requires Teacher Approval)
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
  student.points = Math.max(0, (student.points || 0) + amount);
  saveStudentData(student);

  if (student.id) {
    const rawData = localStorage.getItem(STUDENTS_LIST_KEY);
    if (rawData) {
      try {
        const list = JSON.parse(rawData);
        if (Array.isArray(list)) {
          const updatedList = list.map((s) =>
            s.id === student.id ? { ...s, points: student.points } : s
          );
          localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(updatedList));
        }
      } catch (e) {}
    }
  }

  return student.points;
};

export const addStudentSpins = (count) => {
  const student = getStudentData();
  student.spinsLeft = Math.max(0, (student.spinsLeft || 0) + count);
  saveStudentData(student);

  if (student.id) {
    const rawData = localStorage.getItem(STUDENTS_LIST_KEY);
    if (rawData) {
      try {
        const list = JSON.parse(rawData);
        if (Array.isArray(list)) {
          const updatedList = list.map((s) =>
            s.id === student.id ? { ...s, spinsLeft: student.spinsLeft } : s
          );
          localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(updatedList));
        }
      } catch (e) {}
    }
  }

  return student.spinsLeft;
};

export const addStudentBoxes = (count) => {
  const student = getStudentData();
  student.boxesLeft = Math.max(0, (student.boxesLeft || 0) + count);
  saveStudentData(student);
  return student.boxesLeft;
};

const STUDENTS_LIST_KEY = 'STAMP_MARKET_STUDENTS_LIST_V7';

// Generate 30 sample students array with custom credentials (MASTER TRUTH)
export const generate30SampleStudents = () => {
  const customStudents = [
    { id: 'student01', password: '1663', name: 'Choi, Seungjae E5', points: 115 },
    { id: 'student02', password: '9404', name: 'Han, Yena E5', points: 348 },
    { id: 'student03', password: '9198', name: 'Kang, Sechan E5', points: 317 },
    { id: 'student04', password: '2504', name: 'Lee, David (이지율) E5', points: 334 },
    { id: 'student05', password: '6461', name: 'Lee, Eden E5', points: 372 },
    { id: 'student06', password: '9616', name: 'Lee, Juho E5', points: 295 },
    { id: 'student07', password: '1440', name: 'Lee, Siwoo E5', points: 238 },
    { id: 'student08', password: '9165', name: 'Lee, Tay E5', points: 281 },
    { id: 'student09', password: '1767', name: 'Oh, Pyeongan E5', points: 304 },
    { id: 'student10', password: '2272', name: 'Kang, Dongho M6', points: 213 },
    { id: 'student11', password: '8556', name: 'Kim, Dayeon M6', points: 291 },
    { id: 'student12', password: '5682', name: 'Kim, Yigeon M6', points: 270 },
    { id: 'student13', password: '8605', name: 'Lee, Sangwoo M6', points: 321 },
    { id: 'student14', password: '8339', name: 'Park, Habin M6', points: 261 },
    { id: 'student15', password: '7180', name: 'Ryu, Hayeon M6', points: 280 },
    { id: 'student16', password: '4679', name: 'Yang, Sion M6', points: 201 },
    { id: 'student17', password: '6736', name: 'Yoon, Lael M6', points: 228 },
    { id: 'student18', password: '3880', name: 'Yun, Keonwoo M6', points: 125 },
    { id: 'student19', password: '1918', name: 'Jeong, Raon M7', points: 137 },
    { id: 'student20', password: '6320', name: 'Oh, Sion M7', points: 210 },
    { id: 'student21', password: '9926', name: 'Park, Haon M7', points: 235 },
    { id: 'student22', password: '5456', name: 'Shin, Hajun M7', points: 30 },
    { id: 'student23', password: '1623', name: 'Song, Sangyun M7', points: 135 },
    { id: 'student24', password: '1494', name: 'Yoo, Hajoon M7', points: 149 },
    { id: 'student25', password: '5983', name: 'Yoon, Seokhyeon M7', points: 177 },
    { id: 'student26', password: '3343', name: 'Kim, Riwon M8', points: 286 },
    { id: 'student27', password: '2598', name: 'Lee, Heeel M8', points: 117 },
    { id: 'student28', password: '9204', name: 'Song, Yuvin M8', points: 324 },
    { id: 'student29', password: '2827', name: '황규문', points: 1000 },
    { id: 'student30', password: '9557', name: '이재원', points: 1000 }
  ];

  return customStudents.map((s, i) => ({
    ...s,
    spinsLeft: 0,
    avatar: ['🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🐰', '🐸', '🦄', '🐬'][i % 10]
  }));
};

export const getStudentsList = () => {
  const masterDefaults = generate30SampleStudents();
  const data = localStorage.getItem(STUDENTS_LIST_KEY);
  if (!data) {
    saveStudentsList(masterDefaults);
    return masterDefaults;
  }
  try {
    const saved = JSON.parse(data);
    if (!Array.isArray(saved) || saved.length === 0) {
      saveStudentsList(masterDefaults);
      return masterDefaults;
    }

    const merged = masterDefaults.map((master) => {
      const match = saved.find((s) => s.id === master.id);
      return {
        ...master,
        points: (match && typeof match.points === 'number') ? match.points : master.points,
        spinsLeft: (match && typeof match.spinsLeft === 'number') ? match.spinsLeft : master.spinsLeft
      };
    });
    saveStudentsList(merged);
    return merged;
  } catch (e) {
    saveStudentsList(masterDefaults);
    return masterDefaults;
  }
};

export const saveStudentsList = (students) => {
  localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(students));
};

// Download CSV Sample File (30 Students)
export const downloadSampleCSV = () => {
  const students = getStudentsList();
  let csvContent = 'ID,Password,Name,Points\n';
  students.forEach((s) => {
    const formattedName = s.name.includes(',') ? `"${s.name}"` : s.name;
    csvContent += `${s.id},${s.password},${formattedName},${s.points}\n`;
  });

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'SummerSchool_30_Students_List.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Parse Uploaded Students CSV Text
export const parseCSVAndSaveStudents = (csvText) => {
  if (!csvText) return null;
  // Clean UTF-8 BOM if present
  const cleanedText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanedText.split(/\r\n|\n/);
  const students = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Skip header line
    if (i === 0 && (line.toLowerCase().includes('id') || line.includes('비밀번호') || line.includes('이름'))) {
      continue;
    }

    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    const cleanedParts = parts.map(p => p.replace(/^"/, '').replace(/"$/, '').trim());

    if (cleanedParts.length >= 3) {
      const id = cleanedParts[0];
      const password = cleanedParts[1];
      const name = cleanedParts[2];
      const points = parseInt(cleanedParts[3] || '100', 10) || 100;

      students.push({
        id: id || `student${String(students.length + 1).padStart(2, '0')}`,
        password: password || '1001',
        name: name || `학생_${students.length + 1}`,
        points: points,
        spinsLeft: 0,
        avatar: ['🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🐰', '🐸', '🦄', '🐬'][students.length % 10]
      });
    }
  }

  if (students.length > 0) {
    saveStudentsList(students);
    saveStudentData(students[0]); // Set current student profile to 1st uploaded student
    return students;
  }
  return null;
};

// Download Teacher Items CSV Sample File (Name, Price, Stock Only)
export const downloadItemsSampleCSV = () => {
  const items = getTeacherItems();
  let csvContent = 'Name,Price,Stock\n';
  items.forEach((item) => {
    csvContent += `"${item.name}",${item.price},${item.stock || 20}\n`;
  });

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'SummerSchool_Items_List.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Parse Uploaded Items CSV Text & Auto Generate Item IDs/QRs (Name, Price, Stock Only)
export const parseCSVAndSaveItems = (csvText) => {
  if (!csvText) return null;
  const cleanedText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanedText.split(/\r\n|\n/);
  const newItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip header line
    if (i === 0 && (line.toLowerCase().includes('name') || line.includes('물품명') || line.includes('이름') || line.includes('가격'))) {
      continue;
    }

    const parts = line.split(',').map(p => p.trim().replace(/^"/, '').replace(/"$/, ''));

    if (parts.length >= 2) {
      const name = parts[0] || `신규 물품_${i}`;
      const price = parseInt(parts[1], 10) || 10;
      const stock = parseInt(parts[2], 10) || 20;

      newItems.push({
        id: `item_${Date.now()}_${i}`,
        name: name,
        price: price,
        stock: stock
      });
    }
  }

  if (newItems.length > 0) {
    saveTeacherItems(newItems);
    return newItems;
  }
  return null;
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
    type: 'STAMP_ITEM',
    id: item.id,
    name: item.name,
    price: item.price
  });
};

export const encodePointQR = (points, label = '칭찬 스탬프') => {
  return JSON.stringify({
    type: 'STAMP_ADD',
    points: parseInt(points, 10),
    label: label
  });
};

export const encodeWheelQR = (spins = 1) => {
  return JSON.stringify({
    type: 'STAMP_WHEEL',
    spins: parseInt(spins, 10),
    label: 'Temu 럭키 룰렛 승인 티켓'
  });
};

export const encodeBoxQR = (boxes = 1) => {
  return JSON.stringify({
    type: 'STAMP_BOX',
    boxes: parseInt(boxes, 10),
    label: '럭키 뽑기 상자 승인 티켓'
  });
};

export const parseQRData = (rawText) => {
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && parsed.type) {
      if (parsed.type.startsWith('DALLAR_')) {
        parsed.type = parsed.type.replace('DALLAR_', 'STAMP_');
      }
      return parsed;
    }
  } catch (e) {
    // Fallback for simple legacy text format (both STAMP_ and DALLAR_ supported)
    if (rawText.startsWith('STAMP_ITEM:') || rawText.startsWith('DALLAR_ITEM:')) {
      const id = rawText.replace('STAMP_ITEM:', '').replace('DALLAR_ITEM:', '');
      const items = getTeacherItems();
      const item = items.find(i => i.id === id);
      if (item) {
        return { type: 'STAMP_ITEM', ...item };
      }
    } else if (rawText.startsWith('STAMP_ADD:') || rawText.startsWith('DALLAR_ADD:')) {
      const pts = parseInt(rawText.replace('STAMP_ADD:', '').replace('DALLAR_ADD:', ''), 10);
      return { type: 'STAMP_ADD', points: pts, label: '칭찬 스탬프' };
    } else if (rawText.startsWith('STAMP_WHEEL:') || rawText.startsWith('DALLAR_WHEEL:')) {
      const spins = parseInt(rawText.replace('STAMP_WHEEL:', '').replace('DALLAR_WHEEL:', ''), 10) || 1;
      return { type: 'STAMP_WHEEL', spins: spins, label: '럭키 룰렛 승인 티켓' };
    }
  }
  return null;
};
