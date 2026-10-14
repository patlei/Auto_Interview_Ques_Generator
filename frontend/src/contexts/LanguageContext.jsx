/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // 默认设为中文
  const [language, setLanguage] = useState('zh');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'zh' : 'en'));
  };

  const translations = {
    en: {
      brandName: 'InterviewMaster',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Enter your password',
      usernamePlaceholder: 'Enter your username',
      loginSubtitle: 'Sign in to manage your profile',
      registerSubtitle: 'Join InterviewMaster to prepare with confidence',
      agentDescription: 'Upload your CV and JD, and let AI generate precision interview kits in 10 seconds.',
      forgotPassword: 'Forgot Password?',
      or: 'OR',
      agreeTerms: 'By creating an account, you agree to our Terms of Service.',
      copyright: '© 2026 InterviewMaster. AI-powered interview preparation.',
      chinese: 'Chinese',
      english: 'English',
      lightMode: 'Light',
      darkMode: 'Dark',
      dashboard: 'My Reports',
      logout: 'Logout',
      CopyAll: "Copy All",
      exportMD: "Export Markdown",
      cvMatchReport: "CV Match Analysis",
      fitScore: "Match Score",
      keyStrengths: "Key Strengths",
      potentialGaps: "Potential Gaps",
      aiInsight: "AI Insight",
      interviewPrep: "Interview Question Bank",
      questions: "Questions",
      interviewerIntent: "INTERVIEWER INTENT",
      suggestedAnswer: "SUGGESTED ANSWER",
      readyToStart: "Ready to create your interview plan?",
      fillLeftPanel: "Upload your resume and add the job description to get started.",
      generateQuestions: "Generate interview plan",
      clickToUpload: "Click to upload your resume",
      step1: "1. Upload Resume (Resume/CV)",
      step2: "2. Job Description (JD)",
      step3: "3. Interviewer Preferences (Optional)",
      jdPlaceholder: "Paste the JD content here...\n\nIncluding: Responsibilities, Requirements, and Tech Stack.",
      prefPlaceholder: "E.g., CTO, focuses on system design and scalability"
    },
    zh: {
      brandName: 'InterviewMaster',
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      username: '用户名',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '请输入密码',
      usernamePlaceholder: '请输入用户名',
      loginSubtitle: '登录后管理你的主页',
      registerSubtitle: '加入 InterviewMaster，更有把握地准备每场面试',
      agentDescription: '上传你的简历，AI 10 秒内自动生成精准的个性化面试题。',
      forgotPassword: '忘记密码？',
      or: '或',
      agreeTerms: '创建账户即表示您同意我们的服务条款。',
      copyright: '© 2026 InterviewMaster. AI 驱动的面试准备工具。',
      chinese: '中文',
      english: '英文',
      lightMode: '浅色',
      darkMode: '深色',
      dashboard: '我的报告',
      logout: '退出登录',
      // ... 其他词条
      CopyAll: "复制全部",
      exportMD: "导出 Markdown",
      cvMatchReport: "简历匹配度分析",
      fitScore: "匹配得分",
      keyStrengths: "核心优势",
      potentialGaps: "待提升点",
      aiInsight: "AI洞察",
      interviewPrep: "精选面试题库",
      questions: "道题目",
      interviewerIntent: "考察意图",
      suggestedAnswer: "参考答案建议",
      readyToStart: "准备好生成专属面试方案了吗？",
      fillLeftPanel: "上传简历并填写职位描述，即可开始分析。",
      generateQuestions: "生成面试方案",
      clickToUpload: "点击上传你的简历",
      step1: "1. 上传个人简历 (Resume/CV)",
      step2: "2. 职位描述 (JD)",
      step3: "3. 面试官偏好 (可选)",
      jdPlaceholder: "请在此处粘贴职位描述内容...\n\n包含：岗位职责、任职要求、技术栈等。",
      prefPlaceholder: "例如：CTO，侧重考察系统设计能力和架构扩展性"
    },
  };

  const t = translations[language];

  const value = {
    language,
    toggleLanguage,
    t,
    isEnglish: language === 'en',
    isChinese: language === 'zh',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
