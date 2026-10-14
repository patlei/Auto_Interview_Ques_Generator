import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  Container,
  Divider,
} from '@mui/material';
import {
  Moon,
  Sun,
  UserCircle,
  FileText,
  LogOut,
  Languages,
  Sparkles,
} from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import { alpha } from '@mui/material/styles';

function Navbar({ isAuthenticated, onLogout, onDashboardClick, onLogoClick, currentView }) {
  const { toggleMode, isDarkMode } = useThemeContext();
  const { toggleLanguage, isEnglish, t } = useLanguageContext();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const closeMenu = () => setAnchorEl(null);
  const dashboardActive = currentView === 'dashboard' || currentView === 'view';

  const iconButtonStyle = {
    color: 'text.secondary',
    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: isDarkMode ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.9)',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(14px)',
        zIndex: 1300,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, sm: 64 } }}>
          <ButtonBase
            onClick={onLogoClick}
            aria-label={isEnglish ? 'Go to workspace' : '返回工作台'}
            sx={{
              borderRadius: '10px',
              p: '6px 8px 6px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              '&.Mui-focusVisible': { boxShadow: `0 0 0 3px ${theme.palette.primary.main}33` },
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Sparkles size={18} aria-hidden="true" />
            </Box>
            <Typography
              component="span"
              sx={{
                fontWeight: 750,
                fontSize: { xs: '0.98rem', sm: '1.05rem' },
                letterSpacing: '-0.025em',
                whiteSpace: 'nowrap',
              }}
            >
              InterviewMaster
            </Typography>
          </ButtonBase>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {isAuthenticated && (
              <Button
                startIcon={<FileText size={17} aria-hidden="true" />}
                onClick={onDashboardClick}
                aria-current={dashboardActive ? 'page' : undefined}
                aria-label={t.dashboard}
                sx={{
                  px: { xs: 1.25, sm: 1.75 },
                  color: dashboardActive ? 'primary.main' : 'text.secondary',
                  bgcolor: dashboardActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' },
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.75 } },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t.dashboard}
                </Box>
              </Button>
            )}

            <Tooltip title={isEnglish ? '切换至中文' : 'Switch to English'}>
              <Button
                onClick={toggleLanguage}
                aria-label={isEnglish ? '切换至中文' : 'Switch to English'}
                sx={{
                  display: { xs: isAuthenticated ? 'none' : 'inline-flex', sm: 'inline-flex' },
                  minWidth: 52,
                  px: 1.25,
                  color: 'text.secondary',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.06) },
                }}
              >
                {isEnglish ? 'EN' : '中'}
              </Button>
            </Tooltip>

            <Tooltip title={isDarkMode ? (isEnglish ? 'Light mode' : '浅色模式') : (isEnglish ? 'Dark mode' : '深色模式')}>
              <IconButton
                onClick={toggleMode}
                aria-label={isDarkMode ? (isEnglish ? 'Switch to light mode' : '切换到浅色模式') : (isEnglish ? 'Switch to dark mode' : '切换到深色模式')}
                sx={{ ...iconButtonStyle, display: { xs: isAuthenticated ? 'none' : 'inline-flex', sm: 'inline-flex' } }}
              >
                {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
              </IconButton>
            </Tooltip>

            {isAuthenticated && (
              <>
                <Tooltip title={isEnglish ? 'Account' : '账户'}>
                  <IconButton
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    aria-label={isEnglish ? 'Open account menu' : '打开账户菜单'}
                    aria-controls={anchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorEl)}
                    sx={iconButtonStyle}
                  >
                    <UserCircle size={22} strokeWidth={1.7} />
                  </IconButton>
                </Tooltip>

                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 180,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: isDarkMode ? '0 16px 40px rgba(0,0,0,0.35)' : '0 16px 40px rgba(15,23,42,0.12)',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => { toggleLanguage(); closeMenu(); }}
                    sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1.5, minHeight: 44 }}
                  >
                    <Languages size={18} aria-hidden="true" />
                    <Typography variant="body2">{isEnglish ? '切换至中文' : 'Switch to English'}</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => { toggleMode(); closeMenu(); }}
                    sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1.5, minHeight: 44 }}
                  >
                    {isDarkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                    <Typography variant="body2">
                      {isDarkMode ? (isEnglish ? 'Light mode' : '浅色模式') : (isEnglish ? 'Dark mode' : '深色模式')}
                    </Typography>
                  </MenuItem>
                  <Divider sx={{ display: { xs: 'block', sm: 'none' }, my: 0.5 }} />
                  <MenuItem
                    onClick={() => { closeMenu(); onLogout(); }}
                    sx={{ gap: 1.5, minHeight: 44, color: 'error.main' }}
                  >
                    <LogOut size={18} aria-hidden="true" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.logout}</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
