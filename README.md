다른 네트워크(예: 교회, 외부 여름스쿨 장소, 새로운 와이파이 환경)로 컴퓨터를 옮겨서 실행하실 때는 **네트워크 환경(IP 주소)이 자동으로 바뀌게 됩니다.**

이때 접속하실 수 있는 **가장 추천하는 2가지 방법**을 안내해 드립니다.

---

### 🌟 [방법 1] 가장 추천: Localtunnel 사용 (와이파이가 달라도 접속 가능)

학생들 휴대폰이 컴퓨터와 다른 와이파이나 LTE/5G 데이터에 연결되어 있어도 **인터넷만 되면 무조건 100% 접속되는 가장 편리한 방법**입니다.

1. **터미널 1번**에서 개발 서버를 엽니다:
   ```bash
   npm run dev
   ```
2. **터미널 2번**(새 터미널 열기)에서 외부 주소를 생성합니다:
   ```bash
   npx localtunnel --port 5173
   ```
3. 터미널 화면에 나오는 **`your url is: https://xxxx.loca.lt`** 형태의 주소를 학생들에게 공유하거나 QR 코드로 만들어서 접속하시면 됩니다!

> 💡 **Localtunnel 처음 접속할 때 팁**: 스마트폰으로 접속 시 "Click to Continue" 파란색 버튼이 나오면 한번 눌러주시면 바로 화면이 나타납니다.

---

### 🏠 [방법 2] 같은 와이파이 연결 시 접속 방법 (새로운 로컬 IP 확인)

선생님 컴퓨터와 학생 스마트폰이 **같은 와이파이**에 연결되어 있다면:

1. 해당 장소 와이파이에 컴퓨터를 연결한 후 터미널에서 실행합니다:
   ```bash
   npm run dev
   ```
2. 터미널에 아래와 같이 **새로운 장소의 IP 주소**가 자동으로 출력됩니다:
   ```bash
     ➜  Local:   https://localhost:5173/
     ➜  Network: https://192.168.X.X:5173/   <-- 이 새로운 주소를 확인!
   ```
3. 출력된 `Network: https://192.168.X.X:5173/` 주소로 학생 스마트폰에서 접속하시면 됩니다.

---

### 📌 요약 가이드
장소를 이동하셨을 때는 **`npx localtunnel --port 5173`** 명령어를 함께 실행하여 생성되는 `https://...loca.lt` 주소를 이용하시는 것이 네트워크 변경에 신경 쓸 필요 없이 가장 안정적이고 쉽습니다!

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
