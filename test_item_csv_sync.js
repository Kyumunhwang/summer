// Test Virtual Item CSV Upload & Sync Verification Script
import { parseCSVToItems, saveTeacherItems, getTeacherItems } from './src/utils/storage.js';

// Mock localStorage for Node.js test environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; }
};

console.log('=== 🧪 1. 가상의 물품 CSV 데이터 생성 ===');
const virtualItemCSV = `id,name,price,stock,category,badge,description
item_csv_101,유기농 달콤한 딸기 슬러시,12,50,음료,HOT,여름철 최우수 인기 슬러시
item_csv_102,스페셜 캐릭터 피규어 세트,40,10,선생님특선,RARE,선생님이 직접 전달하는 피규어
item_csv_103,스마트 미니 문구 팩,18,30,문구,BEST,귀여운 미니 문구 펜세트`;

console.log(virtualItemCSV);

console.log('\n=== 🔄 2. CSV 파싱 및 스토리지 업로드 적용 ===');
const parsedItems = parseCSVToItems(virtualItemCSV);
console.log('파싱된 물품 수량:', parsedItems.length, '개');
console.log('파싱 결과:', JSON.stringify(parsedItems, null, 2));

saveTeacherItems(parsedItems);

console.log('\n=== 📱 3. 휴대폰 / 동기화 디바이스 저장소 읽기 검증 ===');
const syncedItems = getTeacherItems();
console.log('동기화 후 저장소 물품 수량:', syncedItems.length, '개');

const item1 = syncedItems.find(i => i.id === 'item_csv_101');
const item2 = syncedItems.find(i => i.id === 'item_csv_102');

if (item1 && item1.name === '유기농 달콤한 딸기 슬러시' && item2 && item2.price === 40) {
  console.log('\n✅ [검증 성공] 가상 물품 CSV 업로드 데이터가 스토리지에 완벽 반영 및 동기화 준비 완료되었습니다!');
} else {
  console.error('\n❌ [검증 실패] 데이터 동기화 중 오류가 발생했습니다.');
}
