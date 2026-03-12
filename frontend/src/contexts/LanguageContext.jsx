import { CopyAll } from '@mui/icons-material';
import React, { createContext, useState, useContext, useMemo } from 'react';

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
      brandName: 'InteviewApp',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Enter your password',
      namePlaceholder: 'Enter your name',
      loginSubtitle: 'Sign in to manage your profile',
      registerSubtitle: 'Join InteviewApe to power up your career',
      agentDescription: 'Upload your CV and JD, and let AI generate precision interview kits in 10 seconds.',
      forgotPassword: 'Forgot Password?',
      or: 'OR',
      agreeTerms: 'By creating an account, you agree to our Terms of Service.',
      copyright: '© 2026 InteviewApe. AI-Powered Resume Tool.',
      chinese: 'Chinese',
      english: 'English',
      lightMode: 'Light',
      darkMode: 'Dark',
      dashboard: 'Dashboard',
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
      step1: "1. Upload Resume (Resume/CV)",
      step2: "2. Job Description (JD)",
      step3: "3. Interviewer Preferences (Optional)",
      jdPlaceholder: "Paste the JD content here...\n\nIncluding: Responsibilities, Requirements, and Tech Stack.",
      prefPlaceholder: "E.g., CTO, focuses on system design and scalability"
    },
    zh: {
      brandName: 'InteviewApp',
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      name: '姓名',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '请输入密码',
      namePlaceholder: '请输入姓名',
      loginSubtitle: '登录后管理你的主页',
      registerSubtitle: '加入 InteviewApp，开启 AI 面试之旅',
      agentDescription: '上传你的简历，AI 10 秒内自动生成精准的个性化面试题。',
      forgotPassword: '忘记密码？',
      or: '或',
      agreeTerms: '创建账户即表示您同意我们的服务条款。',
      copyright: '© 2026 InteviewApp. AI 驱动的简历转换工具。',
      chinese: '中文',
      english: '英文',
      lightMode: '浅色',
      darkMode: '深色',
      dashboard: '控制台',
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
      step1: "1. 上传个人简历 (Resume/CV)",
      step2: "2. 职位描述 (JD)",
      step3: "3. 面试官偏好 (可选)",
      jdPlaceholder: "请在此处粘贴职位描述内容...\n\n包含：岗位职责、任职要求、技术栈等。",
      prefPlaceholder: "例如：CTO，侧重考察系统设计能力和架构扩展性"
    },
  };

  const t = useMemo(() => translations[language], [language]);

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