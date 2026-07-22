// Node.js Automated Integration Test Script for Student CSV Upload & Login Verification

// Mock localStorage for Node.js testing
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};

const STUDENTS_STORAGE_KEY = 'DALLAR_STUDENTS_LIST_V7';

const saveAllStudents = (students) => {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
};

const getAllStudents = () => {
  const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
};

const loginStudent = (idInput, passwordInput) => {
  const students = getAllStudents();
  const cleanId = String(idInput || '').trim().toLowerCase();
  const cleanPw = String(passwordInput || '').trim();

  const found = students.find(s => {
    const sId = String(s.id || '').trim().toLowerCase();
    const sName = String(s.name || '').trim().toLowerCase();
    const sPw = String(s.password || '').trim();

    return (sId === cleanId || sName === cleanId) && sPw === cleanPw;
  });

  if (found) {
    return { success: true, student: found };
  }
  return { success: false, message: 'ID(또는 이름)와 비밀번호를 확인해주세요.' };
};

const parseCSVToStudents = (csvText) => {
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

// --- RUN VERIFICATION TEST ---
console.log('=== 🧪 1. STARTING CSV UPLOAD & LOGIN TEST ===');

const dummyCSVData = `id,name,password,points,spinsLeft
std_88,테스트학생A,8888,300,1
std_99,테스트학생B,9999,500,1`;

console.log('\n📄 [Input Virtual CSV Content]:');
console.log(dummyCSVData);

console.log('\n⚙️ [Parsing Virtual CSV & Saving to Storage...]');
const parsed = parseCSVToStudents(dummyCSVData);
console.log(`✅ Parsed ${parsed.length} students into storage.`);

console.log('\n🔐 [Testing Login for Virtual Student 1: std_88 / pw: 8888]');
const res1 = loginStudent('std_88', '8888');
if (res1.success) {
  console.log('🎉 SUCCESS! Login Passed for std_88:', res1.student);
} else {
  console.error('❌ FAILED for std_88:', res1.message);
}

console.log('\n🔐 [Testing Login for Virtual Student 2: 테스트학생B / pw: 9999 (by Name)]');
const res2 = loginStudent('테스트학생B', '9999');
if (res2.success) {
  console.log('🎉 SUCCESS! Login Passed for 테스트학생B:', res2.student);
} else {
  console.error('❌ FAILED for 테스트학생B:', res2.message);
}

if (res1.success && res2.success) {
  console.log('\n=============================================');
  console.log('💯 TEST COMPLETED SUCCESSFULLY! ALL VIRTUAL CSV STUDENTS ARE READY & LOGGED IN!');
  console.log('=============================================');
} else {
  process.exit(1);
}
