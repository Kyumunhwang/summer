# Summer School Dallar Market (Vercel & Cloud Deployment Guide)

## 1. 개요 (Overview)
본 프로젝트는 **Vercel(프론트엔드)**과 **Render / Railway / 로컬 PC(백엔드 WebSocket)**의 하이브리드 아키텍처로 웹호스팅에 최적화되어 있습니다.

- **Vercel:** React SPA 빌드 및 전세계 CDN 배포 (무료, SSL/HTTPS 자동 적용)
- **FastAPI Backend:** Python 실시간 동시성 재고 차감 및 WebSocket 브로드캐스트

---

## 2. Vercel 배포 방법 (초간단 3단계)

### 1단계: GitHub 저장소에 최신 코드 푸시
```bash
git add .
git commit -m "Configure Vercel deployment settings"
git push origin main
```

### 2단계: Vercel에서 프로젝트 가져오기 (Import)
1. [Vercel](https://vercel.com)에 로그인 (GitHub 계정으로 로그인 권장)
2. **Add New...** -> **Project** 클릭
3. GitHub 저장소(`summer` 또는 `summer-market`)를 찾아 **Import** 클릭
4. 설정값 확인:
   - **Framework Preset:** `Vite` (자동 감지됨)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables (환경 변수 - 선택 사항):**
   - 만약 클라우드 백엔드(Render 등)를 배포했다면 추가:
     - Name: `VITE_BACKEND_URL`
     - Value: `https://your-backend-url.onrender.com`
   - (설정하지 않으면 브라우저의 LocalStorage 기반으로 안전하게 단독 구동됩니다)
6. **Deploy** 버튼 클릭! (약 1분 이내 배포 완료)

---

## 3. 실시간 백엔드 클라우드 호스팅 (Render 무료 배포 가이드)
FastAPI 백엔드의 0.01초 실시간 WebSocket 기능을 인터넷 전체에서 사용하려면 Render에 무료로 배포할 수 있습니다:

1. [Render](https://render.com) 접속 및 로그인
2. **New +** -> **Web Service** 선택
3. GitHub 저장소 연결
4. 설정값 입력:
   - **Name:** `summer-market-api`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
5. 생성된 주소(예: `https://summer-market-api.onrender.com`)를 Vercel의 `VITE_BACKEND_URL`에 넣어주면 전세계 어디서든 실시간 동기화가 완벽 작동합니다.
