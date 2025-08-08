

```markdown
# 🎤 AI Inference App – Voice Transcription & Analysis

This repository contains a **full-stack AI-powered voice transcription application**.  
It allows users to **record speech via a mobile app**, send it to a backend server, and receive **transcribed text** using AI-based speech-to-text models.

---

## 📂 Project Structure

```

AI-inference-app/
│
├── expo-voice-demo/         # 📱 Mobile app built with Expo (React Native)
│   ├── app/                 # Screens and navigation
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── assets/              # Images, icons, fonts
│   └── package.json         # Frontend dependencies
│
├── transcribe-server/       # 💻 Backend API server
│   ├── uploads/             # Temporary storage for audio files
│   ├── index.js              # Express server entry point
│   └── package.json         # Backend dependencies
│
├── package.json             # Root project dependencies (if applicable)
└── README.md

````

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/AI-inference-app.git
cd AI-inference-app
````

### 2️⃣ Install Dependencies

#### Frontend (Expo app)

```bash
cd expo-voice-demo
npm install
```

#### Backend (Node.js server)

```bash
cd ../transcribe-server
npm install
```

---

## ▶️ Running the App

### Start the Backend

```bash
cd transcribe-server
node index.js
```

The server will run on **[http://localhost:3000](http://localhost:3000)** by default.

### Start the Frontend

```bash
cd ../expo-voice-demo
npx expo start
```

Scan the QR code using **Expo Go** on your phone.

---

## ⚙️ Environment Variables

### Backend (`transcribe-server/.env`)

```
PORT=3000
TRANSCRIPTION_API_KEY=your_api_key_here
```

### Frontend (`expo-voice-demo/.env`)

```
API_URL=http://<your-local-ip>:3000
```

---

## 🛠 Tech Stack

* **Frontend:** React Native, Expo
* **Backend:** Node.js, Express
* **Speech-to-Text:** AI model (e.g., Whisper API, Google Speech API, etc.)
* **Storage:** Local file storage for uploads

---

## ✨ Features

* 🎙 Record voice directly from your mobile device
* 🔄 Upload audio to backend server
* 📝 AI-based speech-to-text transcription
* 🌍 Designed to work in low-resource environments

---


## 📌 Next Steps

* Integrate real-time transcription
* Add multi-language support
* Deploy backend to cloud

```
