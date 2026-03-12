import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // 采用 InteviewApe 的极简黑白灰风格
          primary: {
            main: mode === 'light' ? '#000000' : '#ffffff', // 核心主色改为纯黑/纯白
            contrastText: mode === 'light' ? '#ffffff' : '#000000',
          },
          background: {
            // Light 模式下使用极浅的灰色 (#fafafa)，Dark 模式使用深黑 (#0a0a0a)
            default: mode === 'light' ? '#fafafa' : '#0a0a0a',
            paper: mode === 'light' ? '#ffffff' : '#141414',
          },
          text: {
            primary: mode === 'light' ? '#1a1a1a' : '#f5f5f5',
            secondary: mode === 'light' ? '#666666' : '#a0a0a0',
          },
          divider: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
        },
        shape: {
          borderRadius: 10, // 稍微软化一点圆角，更符合 Image 2 的风格
        },
        typography: {
          // 使用更具现代感的系统字体族
          fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
          ].join(','),
          h4: { fontWeight: 700, letterSpacing: '-0.02em' },
          h5: { fontWeight: 600, letterSpacing: '-0.01em' },
          h6: { fontWeight: 600, letterSpacing: '-0.01em' },
          button: { textTransform: 'none', fontWeight: 500 }, // 按钮不使用全大写
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                padding: '8px 16px',
                boxShadow: 'none', // 默认去除所有按钮阴影
                '&:hover': {
                  boxShadow: 'none',
                },
              },
              containedPrimary: {
                backgroundColor: mode === 'light' ? '#000000' : '#ffffff',
                color: mode === 'light' ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#333333' : '#e0e0e0',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none', // 移除 MUI Dark mode 默认的叠加层样式
                boxShadow: mode === 'light' 
                  ? '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)' 
                  : 'none', // 极简投影
                border: mode === 'light' 
                  ? '1px solid rgba(0,0,0,0.06)' 
                  : '1px solid rgba(255,255,255,0.06)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleMode,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};