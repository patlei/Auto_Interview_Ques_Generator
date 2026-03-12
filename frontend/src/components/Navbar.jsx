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
  Stack
} from '@mui/material';
import { Moon, Sun, UserCircle, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { useLanguageContext } from '../contexts/LanguageContext';

function Navbar({ isAuthenticated, onLogout, onDashboardClick, onLogoClick }) {
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
    fontWeight: 600,
    fontSize: '0.9rem',
    px: 2,
    color: 'text.primary',
    '&:hover': {
      bgcolor: 'rgba(0,0,0,0.04)',
    },
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
        <Toolbar disableGutters sx={{ minHeight: 64, position: 'relative' }}>
          
          {/* Logo/Brand - 居中布局，点击返回主生成页 */}
          <Box 
            onClick={onLogoClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <FileText size={20} color={theme.palette.primary.main} style={{ marginRight: '8px' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-1px',
              }}
            >
              InteviewApp
            </Typography>
          </Box>

          {/* 右侧控制栏 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'absolute', right: 0 }}>
            
            {/* 语言切换按钮 */}
            <Tooltip title={isEnglish ? "切换至中文" : "Switch to English"}>
              <Box
                onClick={toggleLanguage}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.default',
                  borderRadius: '20px',
                  p: '4px 10px',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: '0.3s',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: !isEnglish ? 800 : 400, 
                    color: !isEnglish ? 'text.primary' : 'text.disabled',
                  }}
                >
                  中
                </Typography>
                <Box sx={{ width: '1px', height: '12px', bgcolor: theme.palette.divider, mx: 1 }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: isEnglish ? 800 : 400, 
                    color: isEnglish ? 'text.primary' : 'text.disabled',
                  }}
                >
                  EN
                </Typography>
              </Box>
            </Tooltip>

            {/* 主题切换按钮 */}
            <IconButton onClick={toggleMode} sx={minimalIconButtonStyle}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>

            {/* 登录后的功能按钮 */}
            {isAuthenticated && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {/* 控制台入口 */}
                <Button
                  variant="text"
                  startIcon={<LayoutDashboard size={18} />}
                  onClick={onDashboardClick}
                  sx={minimalButtonStyle}
                >
                  {t.dashboard}
                </Button>

                {/* 用户头像菜单 */}
                <IconButton onClick={handleMenuOpen} sx={minimalIconButtonStyle}>
                  <UserCircle size={24} strokeWidth={1.5} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  elevation={3}
                  PaperProps={{
                    sx: { borderRadius: '12px', mt: 1, minWidth: 150 }
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); onLogout(); }} sx={{ gap: 1.5 }}>
                    <LogOut size={16} color={theme.palette.error.main} />
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      {t.logout}
                    </Typography>
                  </MenuItem>
                </Menu>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;