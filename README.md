# 📧 Email Agent with Next.js + Python

This project integrates a **Next.js frontend** with a **Python Email Agent** that processes Gmail messages automatically.  
It uses Google OAuth for authentication, listens for incoming emails, and can create drafts, mark messages as read, and trigger automated workflows.

---

## 🚀 Features
- Gmail integration with OAuth2
- Automated email draft creation
- Mark emails as read after processing
- Next.js frontend with modern UI
- Concurrent execution of **Next.js dev server** + **Python email agent**

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (Turbopack)
- **Backend**: Python (Gmail API + automation logic)
- **Tools**: 
  - `concurrently` for running multiple services
  - `google-auth`, `google-api-python-client`
  - Custom Python email agent (`app.py`)

---

## 📂 Project Structure
```
Email_Agent-Nextjs/        # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── package.json
│   └── README.md
│
└── email-agent/           # Python backend
    ├── app.py
    ├── requirements.txt
    ├── agents/
    └── utils/
```

---

## ⚡ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/Email_Agent-Nextjs.git
cd Email_Agent-Nextjs
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Setup Python environment
```bash
cd ../email-agent
python -m venv venv
venv\Scripts\activate   # (Windows)
pip install -r requirements.txt
```

### 4. Configure Gmail API
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create OAuth credentials (`credentials.json`)
- Place `credentials.json` inside the `email-agent/` folder

### 5. Run the project
From the **Next.js folder** (`Email_Agent-Nextjs/`):

```bash
npm run email-agent
```

This will:
- Start the Next.js frontend
- Run the Python email agent concurrently

---

## 🎥 Demo

add demo video
---

## 🐛 Troubleshooting

- If you see a `PYTHONUTF8` error on Windows, use:
  ```bash
  setx PYTHONUTF8 1
  ```
  then restart your terminal.

- Make sure `credentials.json` is valid and placed correctly.

---

## 📜 Project Collaboratees

Abubakar Yasir , Mariam Javed , Muhammad Uzair
