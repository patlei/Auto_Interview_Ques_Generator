# Auto Interview Questions Generator

An AI-powered tool designed to automatically generate customized interview questions based on uploaded resumes or job descriptions (JD). It utilizes the DeepSeek API to help job seekers prepare for mock interviews or assist recruiters in building question banks.

## Tech Stack

This project follows a decoupled client-server architecture:

### Frontend
* **Core:** React.js
* **Build Tool:** Vite (Fast build times)
* **Language:** JavaScript / JSX (Scalable to TypeScript)
* **Styling:** CSS / CSS Modules
* **Package Manager:** NPM

### Backend
* **Core:** Python 3.8+
* **Framework:** FastAPI (High-performance web framework)
* **Server:** Uvicorn (ASGI Server)
* **AI Integration:** DeepSeek API
* **Tools:** Python-dotenv (Environment variable management)

---

## Getting Started

Follow these instructions to get a copy of the project running on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/Auto_Interview_Ques_Generator.git](https://github.com/YOUR_USERNAME/Auto_Interview_Ques_Generator.git)
cd AutoInterview

# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment (Recommended)
# Mac/Linux:
python3 -m venv .venv
source .venv/bin/activate
# Windows:
# python -m venv .venv
# .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# backend/.env
DEEPSEEK_API_KEY=your_api_key_here

python -m uvicorn main:app --reload

# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (First time only)
npm install

# 3. Start the development server
npm run dev

AutoInterview/
├── backend/                # Python Backend
│   ├── .venv/              # Virtual Environment (Ignored by Git)
│   ├── __pycache__/        # Python Cache
│   ├── .env                # Config file (Contains API Key - Ignored)
│   ├── deepseek.py         # AI Interaction Logic
│   ├── main.py             # FastAPI Entry Point & Routes
│   ├── requirements.txt    # Python Dependencies
│   └── resume_parser.py    # Resume Parsing Logic
│
├── frontend/               # React Frontend
│   ├── node_modules/       # Node Dependencies (Ignored by Git)
│   ├── src/                # Source Code
│   ├── package.json        # NPM Configuration
│   └── vite.config.js      # Vite Configuration
│
├── .gitignore              # Git Ignore Rules
└── README.md               # Project Documentation

