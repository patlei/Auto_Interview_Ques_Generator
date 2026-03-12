import React, { useState } from 'react';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import { useLanguageContext } from './contexts/LanguageContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [matchReport, setMatchReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguageContext();

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (data) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setResume(null);
    setJd('');
    setInterviewer('');
    setQuestions([]);
    setMatchReport(null);
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    const fileInput = document.getElementById('resume-upload-input');
    if (fileInput) fileInput.value = '';
  };

  // --- 增强版解析逻辑：解决 AI 返回 Markdown 标签导致的解析失败 ---
  const safeParse = (data) => {
    if (!data) return null;
    if (typeof data === 'object') return data;
    
    try {
      // 移除可能存在的 Markdown 代码块标签
      const cleanJson = data.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Parse Error:', e, 'Raw data:', data);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!resume || !jd) {
      alert(t.fillLeftPanel || 'Please upload resume and JD');
      return;
    }

    setLoading(true);
    // 注意：不要在这里清空上一次的结果，保持界面稳定直到新结果出来
    
    try {
      const formData = new FormData();
      // 这里确保 key 名与后端 FastAPI 接收的一致（cv / jd / interviewer_info）
      formData.append('cv', resume);
      formData.append('jd', jd);
      formData.append('interviewer_info', interviewer);

      const res = await fetch('http://127.0.0.1:8000/generate_questions', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Backend server error');

      const data = await res.json();
      console.log('Backend Response:', data);

      // 解析 questions
      const parsedQuestions = safeParse(data.questions);
      // 解析 match_report
      const parsedReport = safeParse(data.match_report);

      // 更新状态：确保 questions 永远是数组
      setQuestions(Array.isArray(parsedQuestions) ? parsedQuestions : []);
      setMatchReport(parsedReport);

    } catch (err) {
      console.error(err);
      alert(isEnglish ? 'Generation failed. Is the backend running?' : '生成失败，请检查后端服务是否启动。');
    } finally {
      setLoading(false);
    }
  };

  // 1. 未登录界面
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </Box>
    );
  }

  // 2. 登录后的主界面 (Dashboard)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onDashboard={() => {}} 
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: 'calc(100vh - 64px)', // 减去 Navbar 高度
          width: '100vw',
          overflow: 'hidden',
          pt: '64px', // 顶部对齐
        }}
      >
        <InputPanel
          resume={resume}
          handleUpload={handleUpload}
          handleRemoveFile={handleRemoveFile}
          jd={jd}
          setJd={setJd}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
          handleGenerate={handleGenerate}
          loading={loading}
        />

        <ResultPanel
          questions={questions}
          matchReport={matchReport}
          loading={loading}
        />
      </Box>
    </Box>
  );
}

export default App;