# 🤖 Auto Interview Questions Generator

An AI-powered tool designed to automatically generate customized interview questions based on uploaded resumes or job descriptions (JD). It utilizes LLM APIs (DeepSeek) to help job seekers prepare for mock interviews or assist recruiters in building question banks.

## 🛠️ Tech Stack

This project follows a decoupled client-server architecture:

### 🎨 Frontend
* **Core:** React.js
* **Build Tool:** Vite
* **Language:** JavaScript / JSX
* **Styling:** CSS / CSS Modules
* **Package Manager:** NPM

### ⚙️ Backend
* **Core:** Python 3.8+
* **Framework:** FastAPI
* **Server:** Uvicorn
* **AI Integration:** DeepSeek API
* **Tools:** Python-dotenv

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/Auto_Interview_Ques_Generator.git](https://github.com/YOUR_USERNAME/Auto_Interview_Ques_Generator.git)
cd AutoInterview

cd backend

# Create a virtual environment
# Mac/Linux:
python3 -m venv .venv
source .venv/bin/activate
# Windows:
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# backend/.env
DEEPSEEK_API_KEY=your_api_key_here

python -m uvicorn main:app --reload

cd frontend

# Install dependencies (First time only)
npm install

# Start the development server
npm run dev
