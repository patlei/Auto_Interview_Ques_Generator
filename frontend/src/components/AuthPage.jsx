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
// 替换为 Lucide 图标
import { User, Mail, Lock, Eye, EyeOff, FileText, Bot } from 'lucide-react';
// 引入语言 Hook
import { useLanguageContext } from '../contexts/LanguageContext';

// 右侧 AI 动态背景面板
const AiBackgroundPanel = ({ t }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "50%",
        height: "100%",
        position: "relative",
        display: { xs: 'none', md: 'flex' }, // 移动端隐藏右侧
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
          {t.brandName}
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: "400px", fontWeight: 400 }}>
          {t.agentDescription}
        </Typography>
      </Stack>
      
      <Box sx={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 1 }}>
         <Bot size={16} color="rgba(255,255,255,0.4)" />
         <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
           {t.copyright}
         </Typography>
      </Box>
    </Box>
  );
};

// 极简输入框样式
const minimalFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "background.paper",
    "& fieldset": {
      borderColor: "rgba(0,0,0,0.08)",
      borderWidth: '1px',
    },
    "&:hover fieldset": {
      borderColor: "rgba(0,0,0,0.15)",
    },
    "&.Mui-focused fieldset": {
      borderWidth: '1px',
    },
  },
  "& .MuiInputLabel-root": {
    color: "text.secondary",
    fontWeight: 400,
  },
};

// 极简按钮样式
const minimalButtonStyle = {
  py: 1.8,
  borderRadius: "10px",
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  letterSpacing: '0.5px',
};

function AuthPage({ onRegisterSuccess, onLoginSuccess }) {
  const theme = useTheme();
  const { t } = useLanguageContext(); // 获取当前的词库对象
  
  const [tabValue, setTabValue] = useState(0); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrors({});
    setSubmitStatus(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      // 此处对接你的后端 API
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      setSubmitStatus('success');

      if (tabValue === 1 && onRegisterSuccess) {
        onRegisterSuccess(formData);
      } else if (tabValue === 0 && onLoginSuccess) {
        onLoginSuccess(formData);
      }
    } catch (error) {
      setSubmitStatus('error');
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
        
        {/* 左侧：验证面板 */}
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

            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
                {tabValue === 0 ? t.loginSuccessful : t.registrationSuccessful}
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
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
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
                  {t.agreeTerms}
                </Typography>
              </Stack>
            </form>
          </Box>
        </Box>

        {/* 右侧：背景面板 */}
        <AiBackgroundPanel t={t} />
      </Box>
    </Box>
  );
}

export default AuthPage;