import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from './supabaseClient'; 

import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import Dashboard from './components/Dashboard'; // 确保你已经创建了这个文件
import { useLanguageContext } from './contexts/LanguageContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true); 
  
  // --- 核心：控制当前显示的页面 ---
  // 'main' 代表生成/结果页
  // 'dashboard' 代表保存的报告列表页
  // 'view' 代表独立的历史报告查看详情页（全屏模式）
  const [currentView, setCurrentView] = useState('main'); 

  // 新增：专门用于存储从控制台点击选中的那份历史报告
  const [selectedReport, setSelectedReport] = useState(null);

  // 业务状态（用于 main 视图下的即时生成）
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [matchReport, setMatchReport] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { t, isEnglish } = useLanguageContext();

  // 监听 Supabase 身份验证状态
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setLoadingSession(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentView('main'); // 登出时重置视图
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 清除所有业务状态
    setResume(null);
    setJd('');
    setInterviewer('');
    setQuestions([]);
    setMatchReport(null);
    setSelectedReport(null);
  };

  // --- 处理从 Dashboard 选中某个历史记录 ---
  const handleSelectHistoryReport = (report) => {
    // 1. 将选中的报告存入专门的查看状态
    setSelectedReport(report);
    // 2. 跳转到独立的详情查看视图，而不是返回 main 视图
    setCurrentView('view'); 
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
      // 确保生成后停留在 main 视图
      setCurrentView('main');
    } catch (err) {
      console.error(err);
      alert(isEnglish ? 'Generation failed.' : '生成失败，请检查后端。');
    } finally {
      setLoading(false);
    }
  };

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
        // Navbar 点击联动
        onDashboardClick={() => setCurrentView('dashboard')} 
        onLogoClick={() => setCurrentView('main')}
        currentView={currentView}
      />
      
      {!isAuthenticated ? (
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleLoginSuccess}
        />
      ) : (
        <Box sx={{ pt: '64px', height: '100vh' }}>
          
          {/* 1. 分析模式 (Main)：左侧输入 + 右侧即时结果 */}
          {currentView === 'main' && (
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden' }}>
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

          {/* 2. 控制台列表模式 (Dashboard) */}
          {currentView === 'dashboard' && (
            <Dashboard onSelectReport={handleSelectHistoryReport} />
          )}

          {/* 3. 独立查看模式 (View)：全屏展示历史内容，不显示左侧 InputPanel */}
          {currentView === 'view' && selectedReport && (
            <Box sx={{ height: '100%', overflow: 'hidden' }}>
              <ResultPanel
                questions={selectedReport.questions}
                matchReport={selectedReport.match_report}
                loading={false}
                // 关键点：开启只读模式
                isReadOnly={true} 
                // 关键点：绑定左上角返回按钮的功能
                onBack={() => setCurrentView('dashboard')} 
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default App;