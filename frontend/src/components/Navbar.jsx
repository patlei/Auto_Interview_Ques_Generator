import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  Container,
} from '@mui/material';
import { Moon, Sun, UserCircle, FileText } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';

function Navbar({ isAuthenticated, onLogout, onDashboard }) {
  const { toggleMode, isDarkMode } = useThemeContext();
  const { toggleLanguage, isEnglish, t } = useLanguageContext();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 极简风格的按钮样式
  const minimalButtonStyle = {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    px: 2,
  };

  // 极简图标按钮样式
  const minimalIconButtonStyle = {
    border: 'none',
    width: 40,
    height: 40,
    color: 'text.primary',
    '&:hover': {
      bgcolor: 'rgba(0,0,0,0.04)',
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 1300,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Logo/Brand - 居中布局 */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
            <FileText size={20} color={theme.palette.primary.main} style={{ marginRight: '8px' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.5px',
              }}
            >
              InteviewApp
            </Typography>
          </Box>

          {/* Controls - 放在右侧 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'absolute', right: 0 }}>
            
            {/* 样式：中英文文本切换按钮 */}
            <Tooltip title={isEnglish ? "切换至中文" : "Switch to English"}>
              <Box
                onClick={toggleLanguage}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  bgcolor: 'rgba(0,0,0,0.03)',
                  borderRadius: '20px',
                  p: '4px 8px',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: '0.3s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: !isEnglish ? 700 : 400, 
                    color: !isEnglish ? 'text.primary' : 'text.secondary',
                    px: 0.5 
                  }}
                >
                  中
                </Typography>
                <Box sx={{ width: '1px', height: '12px', bgcolor: theme.palette.divider, mx: 0.5 }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: isEnglish ? 700 : 400, 
                    color: isEnglish ? 'text.primary' : 'text.secondary',
                    px: 0.5 
                  }}
                >
                  EN
                </Typography>
              </Box>
            </Tooltip>

            {/* 主题切换 */}
            <Tooltip title={isDarkMode ? t.lightMode : t.darkMode}>
              <IconButton onClick={toggleMode} sx={minimalIconButtonStyle}>
                {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </IconButton>
            </Tooltip>

            {/* 用户已登录时的菜单 */}
            {isAuthenticated && (
              <>
                <Button
                  variant="text"
                  startIcon={<FileText size={18} />}
                  onClick={onDashboard}
                  sx={{ ...minimalButtonStyle, color: 'text.primary' }}
                >
                  {t.dashboard}
                </Button>
                <IconButton onClick={handleMenuOpen} sx={minimalIconButtonStyle}>
                  <UserCircle size={24} strokeWidth={1.5} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  elevation={2}
                >
                  <MenuItem onClick={() => { handleMenuClose(); onLogout(); }}>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                      {t.logout}
                    </Typography>
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