import React, { useState } from 'react';
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
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';

const ProductPreview = ({ isEnglish }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: { md: '58%', lg: '60%' },
        minHeight: '100%',
        position: 'relative',
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        p: { md: 4, lg: 5 },
        overflow: 'hidden',
        color: '#FFFFFF',
        background: 'linear-gradient(145deg, #312E81 0%, #4F46E5 58%, #3730A3 100%)',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          top: -170,
          right: -140,
          bgcolor: 'rgba(255,255,255,0.08)',
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 760, position: 'relative', zIndex: 1 }}>
        <Chip
          icon={<Sparkles size={15} />}
          label={isEnglish ? 'AI interview intelligence' : 'AI 面试智能助手'}
          sx={{
            mb: 3,
            color: '#FFFFFF',
            bgcolor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
            '& .MuiChip-icon': { color: '#FFFFFF' },
          }}
        />
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            whiteSpace: 'nowrap',
            fontSize: isEnglish
              ? { md: '1.15rem', lg: '1.65rem', xl: '2.35rem' }
              : { md: '1.9rem', lg: '2.35rem', xl: '3rem' },
          }}
        >
          {isEnglish ? 'Turn every interview into a prepared conversation.' : '让每一次面试，都成为有准备的对话。'}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.76)',
            mb: 5,
            fontSize: isEnglish ? { md: '0.66rem', lg: '0.8rem', xl: '1rem' } : { md: '0.8rem', lg: '1rem' },
            whiteSpace: 'nowrap',
          }}
        >
          {isEnglish
            ? 'Connect your resume with the role, uncover gaps, and practice questions tailored to the opportunity.'
            : '连接你的简历与目标岗位，识别优势和差距，生成真正贴合岗位的面试题。'}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { md: 2.5, lg: 3 },
            borderRadius: '18px',
            bgcolor: alpha(theme.palette.common.white, 0.94),
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 24px 70px rgba(30,27,75,0.35)',
            color: '#0F172A',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {isEnglish ? 'ROLE MATCH' : '岗位匹配度'}
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5 }}>Senior Product Designer</Typography>
            </Box>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'conic-gradient(#4F46E5 0 86%, #E2E8F0 86% 100%)',
              }}
            >
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#FFFFFF', display: 'grid', placeItems: 'center' }}>
                <Typography sx={{ fontWeight: 750, fontVariantNumeric: 'tabular-nums' }}>86%</Typography>
              </Box>
            </Box>
          </Stack>

          <Stack spacing={1.5}>
            {[
              [CheckCircle2, isEnglish ? '3 key strengths identified' : '已识别 3 项核心优势', '#16A34A'],
              [Target, isEnglish ? '12 tailored questions prepared' : '已生成 12 道定制面试题', '#4F46E5'],
              [ShieldCheck, isEnglish ? 'Actionable gap recommendations' : '提供可执行的差距建议', '#D97706'],
            ].map(([Icon, text, color]) => (
              <Stack key={text} direction="row" spacing={1.25} alignItems="center">
                {React.createElement(Icon, { size: 18, color, 'aria-hidden': true })}
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>{text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

function AuthPage({ onRegisterSuccess, onLoginSuccess }) {
  const theme = useTheme();
  const { t, isEnglish } = useLanguageContext();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
    setErrorMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (tabValue === 0) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        if (onLoginSuccess) onLoginSuccess(data.user);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t.passwordMismatch || 'Passwords do not match');
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { username: formData.username } },
        });
        if (error) throw error;

        if (data.user && !data.session) {
          alert(t.checkEmailForVerify || 'Registration successful! Please check your email for the verification link.');
        } else if (onRegisterSuccess) {
          onRegisterSuccess(data.user);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    '& .MuiInputBase-input': { fontSize: { xs: '1rem', sm: '0.95rem' } },
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        pt: { xs: '60px', sm: '64px' },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', minHeight: { xs: 'calc(100dvh - 60px)', sm: 'calc(100dvh - 64px)' } }}>
        <Box
          sx={{
            width: { xs: '100%', md: '42%', lg: '40%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2.5, sm: 5, lg: 8 },
            py: { xs: 5, md: 6 },
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 430 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 750, letterSpacing: '0.12em' }}>
              {isEnglish ? 'INTERVIEW PREPARATION' : 'AI 面试准备'}
            </Typography>
            <Typography component="h1" variant="h4" sx={{ mt: 1, mb: 1 }}>
              {tabValue === 0 ? (isEnglish ? 'Welcome back' : '欢迎回来') : (isEnglish ? 'Create your account' : '创建你的账户')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {tabValue === 0 ? t.loginSubtitle : t.registerSubtitle}
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                minHeight: 44,
                p: 0.5,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                borderRadius: '12px',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': { minHeight: 40, borderRadius: '9px', color: 'text.secondary', fontWeight: 600 },
                '& .Mui-selected': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(15,23,42,0.08)',
                },
              }}
            >
              <Tab label={t.login} />
              <Tab label={t.register} />
            </Tabs>

            {errorMessage && (
              <Alert severity="error" role="alert" sx={{ mb: 2.5, borderRadius: '10px' }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.25}>
                {tabValue === 1 && (
                  <TextField
                    name="username"
                    label={t.username}
                    placeholder={t.usernamePlaceholder}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="username"
                    InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} aria-hidden="true" /></InputAdornment> }}
                    sx={fieldStyle}
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
                  autoComplete="email"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} aria-hidden="true" /></InputAdornment> }}
                  sx={fieldStyle}
                />

                <TextField
                  name="password"
                  label={t.password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete={tabValue === 0 ? 'current-password' : 'new-password'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} aria-hidden="true" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={showPassword ? (isEnglish ? 'Hide password' : '隐藏密码') : (isEnglish ? 'Show password' : '显示密码')}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldStyle}
                />

                {tabValue === 1 && (
                  <TextField
                    name="confirmPassword"
                    label={t.confirmPassword}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t.passwordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock size={18} aria-hidden="true" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            aria-label={showConfirmPassword ? (isEnglish ? 'Hide password' : '隐藏密码') : (isEnglish ? 'Show password' : '显示密码')}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldStyle}
                  />
                )}

                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ minHeight: 48, mt: 1 }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : (tabValue === 0 ? t.login : t.register)}
                </Button>

                <Typography variant="caption" color="text.secondary" textAlign="center">
                  {t.agreeTerms}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>

        <ProductPreview isEnglish={isEnglish} />
      </Box>
    </Box>
  );
}

export default AuthPage;
