import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from './supabaseClient'; // 确保你已经创建了这个文件

import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import { useLanguageContext } from './contexts/LanguageContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true); // 初始化加载状态
  
  // 业务状态
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [matchReport, setMatchReport] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { t, isEnglish } = useLanguageContext();

  // --- 核心：监听 Supabase 身份验证状态 ---
  useEffect(() => {
    // 1. 初始化时检查当前是否有活动的会话
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setLoadingSession(false);
    };

    checkSession();

    // 2. 监听登录、登出、Token 刷新等状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 清除业务状态
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

  const safeParse = (data) => {
    if (!data) return null;
    if (typeof data === 'object') return data;
    try {
      const cleanJson = data.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Parse Error:', e);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!resume || !jd) {
      alert(t.fillLeftPanel || 'Please upload resume and JD');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('cv', resume);
      formData.append('jd', jd);
      formData.append('interviewer_info', interviewer);

      const res = await fetch('http://127.0.0.1:8000/generate_questions', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Backend server error');

      const data = await res.json();
      
      const parsedQuestions = safeParse(data.questions);
      const parsedReport = safeParse(data.match_report);

      setQuestions(Array.isArray(parsedQuestions) ? parsedQuestions : []);
      setMatchReport(parsedReport);

    } catch (err) {
      console.error(err);
      alert(isEnglish ? 'Generation failed. Is the backend running?' : '生成失败，请检查后端服务是否启动。');
    } finally {
      setLoading(false);
    }
  };

  // 如果还在检查 Session 状态，显示加载圈
  if (loadingSession) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress size={40} thickness={4} color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onDashboard={() => {}} 
      />
      
      {!isAuthenticated ? (
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: 'calc(100vh - 64px)',
            width: '100vw',
            overflow: 'hidden',
            pt: '64px',
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
      )}
    </Box>
  );
}

export default App;