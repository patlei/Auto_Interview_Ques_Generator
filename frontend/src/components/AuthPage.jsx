import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import { User, Mail, Lock, Eye, EyeOff, FileText, Bot } from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';
// 1. 引入刚才配置好的 supabase 客户端
import { supabase } from '../supabaseClient';

// 右侧 AI 动态背景面板 (保持原样)
const AiBackgroundPanel = ({ t }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "50%",
        height: "100%",
        position: "relative",
        display: { xs: 'none', md: 'flex' },
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0.95) 100%)`,
        color: "white",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 6,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(25, 118, 210, 0.2)",
          filter: "blur(80px)",
        }}
      />
      
      <Stack spacing={2} alignItems="center" sx={{ zIndex: 1 }}>
        <FileText size={48} strokeWidth={1} />
        <Typography
          variant="h3"
          fontWeight={700}
          letterSpacing="-1px"
          sx={{
            background: 'linear-gradient(90deg, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          InteviewApe
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: "400px", fontWeight: 400 }}>
          {t.agentDescription || "Your professional AI-powered interview preparation assistant."}
        </Typography>
      </Stack>
      
      <Box sx={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 1 }}>
         <Bot size={16} color="rgba(255,255,255,0.4)" />
         <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
           {t.copyright || "© 2026 InteviewApe AI Lab"}
         </Typography>
      </Box>
    </Box>
  );
};

const minimalFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "background.paper",
    "& fieldset": { borderColor: "rgba(0,0,0,0.08)", borderWidth: '1px' },
    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.15)" },
  },
};

const minimalButtonStyle = {
  py: 1.8,
  borderRadius: "10px",
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
};

function AuthPage({ onRegisterSuccess, onLoginSuccess }) {
  const theme = useTheme();
  const { t } = useLanguageContext();
  
  const [tabValue, setTabValue] = useState(0); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 存放具体的错误提示

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. 核心逻辑：对接 Supabase 认证
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (tabValue === 0) {
        // --- 执行登录 ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        // 成功后回调 App.jsx
        if (onLoginSuccess) onLoginSuccess(data.user);

      } else {
        // --- 执行注册 ---
        // 简单校验两次密码
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t.passwordMismatch || "Passwords do not match");
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name, // 将姓名存入用户元数据
            }
          }
        });

        if (error) throw error;

        // 注意：Supabase 默认需要邮箱验证。如果没关验证，data.user 虽然有，但 session 会是 null
        if (data.user && !data.session) {
          alert(t.checkEmailForVerify || "Registration successful! Please check your email for the verification link.");
        } else if (onRegisterSuccess) {
          onRegisterSuccess(data.user);
        }
      }
    } catch (error) {
      // 捕获并显示 Supabase 返回的错误信息
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        pt: "64px",
      }}
    >
      <Box sx={{ display: "flex", width: "100%", height: "calc(100vh - 64px)", overflow: "hidden" }}>
        
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            bgcolor: "background.paper",
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Stack spacing={1} sx={{ mb: 4 }}>
              <FileText size={28} color={theme.palette.text.primary} />
              <Typography variant="h5" fontWeight={600} letterSpacing="-0.5px">
                {tabValue === 0 ? t.login : t.register}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 ? t.loginSubtitle : t.registerSubtitle}
              </Typography>
            </Stack>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                mb: 4,
                borderBottom: `1px solid ${theme.palette.divider}`,
                "& .MuiTabs-indicator": { height: 2, bgcolor: "text.primary" },
              }}
            >
              <Tab label={t.login} sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab label={t.register} sx={{ textTransform: 'none', fontWeight: 500 }} />
            </Tabs>

            {/* 显示错误信息 */}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {tabValue === 1 && (
                  <TextField
                    name="name"
                    label={t.name}
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><User size={18} strokeWidth={1.5} /></InputAdornment>),
                    }}
                    sx={minimalFieldStyle}
                  />
                )}

                <TextField
                  name="email"
                  label={t.email}
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><Mail size={18} strokeWidth={1.5} /></InputAdornment>),
                  }}
                  sx={minimalFieldStyle}
                />

                <TextField
                  name="password"
                  label={t.password}
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><Lock size={18} strokeWidth={1.5} /></InputAdornment>),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={minimalFieldStyle}
                />

                {tabValue === 1 && (
                  <TextField
                    name="confirmPassword"
                    label={t.confirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><Lock size={18} strokeWidth={1.5} /></InputAdornment>),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={minimalFieldStyle}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    ...minimalButtonStyle,
                    bgcolor: "text.primary",
                    color: "background.paper",
                    mt: 2,
                    '&:hover': { bgcolor: "rgba(0,0,0,0.85)" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    tabValue === 0 ? t.login : t.register
                  )}
                </Button>
                
                <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                  {t.agreeTerms || "By clicking, you agree to our Terms and Conditions."}
                </Typography>
              </Stack>
            </form>
          </Box>
        </Box>

        <AiBackgroundPanel t={t} />
      </Box>
    </Box>
  );
}

export default AuthPage;