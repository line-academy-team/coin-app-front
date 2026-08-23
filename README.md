# CoinFolio Frontend

Expo SDK 54와 Expo Router 기반의 코인 포트폴리오 시뮬레이션 앱입니다.

## 실행

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm start
```

웹에서는 기본적으로 `http://localhost:8080`, Android 에뮬레이터에서는 `http://10.0.2.2:8080`의 백엔드에 연결합니다. 실제 기기나 다른 서버를 사용할 때는 실행 전에 API 주소를 지정합니다.

```powershell
$env:EXPO_PUBLIC_API_BASE_URL = "http://192.168.0.10:8080"
corepack pnpm start
```

## 검증

```powershell
corepack pnpm exec tsc --noEmit
corepack pnpm exec eslint .
corepack pnpm exec expo export --platform web
```
