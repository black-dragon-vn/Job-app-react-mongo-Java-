# 🏢 Job Portal - 起動手順

## 📁 フォルダ構成

```
Job App/
├── Job Portal/                                        # フロントエンド (React + Vite)
└── Job Portal backend/
    └── Job-Portal/
        └── src/main/java/com/jobportal/Job/Portal/   # バックエンド (Spring Boot)
```

---

## 必要な環境

- Node.js ≥ 18
- Java ≥ 17
- MongoDB（ポート `27017` で起動済みであること）

---

## 1. MongoDB を起動する

```bash
mongod --dbpath /data/db --port 27017
```

> すでにサービスとして起動している場合はこの手順は不要です。

---

## 2. バックエンドを起動する（Spring Boot）

```bash
cd "Job App/Job Portal backend/Job-Portal"
./mvnw spring-boot:run
```

> API サーバーが **http://localhost:8080** で起動します。

---

## 3. フロントエンドを起動する（React + Vite）

```bash
cd "Job App/Job Portal"
npm install
npm run dev
```

> ブラウザで **http://localhost:5173** を開いてください。

---

## 📌 ポート一覧

| サービス       | URL / ポート               |
|----------------|----------------------------|
| フロントエンド | http://localhost:5173      |
| バックエンド   | http://localhost:8080      |
| MongoDB        | mongodb://localhost:27017  |

---

> 起動順序：**MongoDB → Backend → Frontend** の順で起動してください。
"# email-kanri" 
