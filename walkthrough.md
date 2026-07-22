# 🎮 2026 Summer School Dallar Market (고도화 [A안] 및 Google Sheet 연동 구동 완료)

선생님과 학생들이 여름방학 Funday 당일에 신나게 사용할 수 있는 **Temu 스타일 Standalone 달란트 마켓 시스템**에 **Google Sheet CSV 연동, 업적 뱃지 자동 해금, 재고 차감 및 품절 처리 기능**이 완벽히 고도화 적용되었습니다.

---

## 🌟 이번 고도화에서 추가된 주요 기능

### 1. 📊 Google Sheet (CSV) 가져오기 & 백업 다운로드
- **선생님 Admin 패널 ➔ Google Sheet CSV 연동 버튼**:
  - 구글 시트에서 `[파일] ➔ [다운로드] ➔ [CSV]`로 다운로드받은 텍스트를 그대로 복사-붙여넣기하여 **상품 및 학생 지갑 데이터 일괄 업데이트**.
  - **CSV 백업 다운로드**: 등록된 상품 데이터를 CSV 파일로 즉시 내보내기 지원 (`sample_items.csv`, `sample_students.csv` 가 `/public` 디렉토리에 함께 제공됨).

### 2. 🏆 게이머블 업적(Achievement) & Toast 연출
- **미션 조건 달성 시 실시간 Toast & 폭죽 연출**:
  - 🎯 **첫 걸음**: 첫 번째 상품 구매 시 해금
  - 🍦 **스위트 쇼퍼**: 물품 2회 이상 구매 시 해금
  - 🎡 **룰렛의 신**: 룰렛 3회 이상 돌릴 시 해금
  - 💰 **달란트 부자**: 보유 포인트 150D 이상 달성 시 해금
  - 👑 **VIP 게스트**: 40D 이상의 스페셜 상품 구매 시 해금
- 학생 화면의 **`🎖️ 획득 뱃지`** 클릭 시 **전체 업적 목록 모달**이 열려 미달성/해금 완료 현황 확인 가능.

### 3. 📦 재고(Stock) 자동 차감 & 품절(SOLD OUT) 처리
- 상품 구매 확정 시 해당 상품의 `stock` 수량이 1개씩 자동 차감.
- 재고가 0개일 경우 **[SOLD OUT]** 뱃지 표기 및 구매 버튼 비활성화.
- 선생님 패널에서 상품별 실시간 남아있는 재고 수량 모니터링 가능.

---

## 🛠️ 주요 수정 및 추가된 파일 목록

- [storage.js](file:///e:/summer/summer/src/utils/storage.js): CSV 파서/익스포터, 업적 체크 엔진 (`checkAndUnlockBadges`), 재고 차감 (`deductItemStock`)
- [App.jsx](file:///e:/summer/summer/src/App.jsx): 재고 차감 및 업적 해금 Toast 알림 팝업 전역 처리
- [StudentView.jsx](file:///e:/summer/summer/src/components/StudentView.jsx): 재고 품절(SOLD OUT) UI, 업적 목록 모달 팝업 추가
- [TeacherView.jsx](file:///e:/summer/summer/src/components/TeacherView.jsx): Google Sheet CSV 불러오기 모달 및 CSV 백업 버튼 추가
- [sample_items.csv](file:///e:/summer/summer/public/sample_items.csv): Google Sheet 상품 샘플 데이터
- [sample_students.csv](file:///e:/summer/summer/public/sample_students.csv): Google Sheet 학생 지갑 샘플 데이터
- [index.css](file:///e:/summer/summer/src/index.css): Toast 애니메이션, CSV 모달, Stock/Sold-out 및 업적 리스트 CSS 추가

---

## 🚀 검증 결과 (Verification Results)

- **자동 빌드 검증 (`npm run build`)**: 
  - `transforming...✓ 1809 modules transformed. built in 3.63s` (문법 오류 0건, 정상 패키징 완료)
