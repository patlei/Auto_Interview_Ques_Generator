/* eslint-disable react-refresh/only-export-components */
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
          primary: {
            main: mode === 'light' ? '#4F46E5' : '#818CF8',
            dark: mode === 'light' ? '#4338CA' : '#6366F1',
            light: mode === 'light' ? '#EEF2FF' : '#312E81',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: mode === 'light' ? '#0F172A' : '#CBD5E1',
          },
          success: { main: mode === 'light' ? '#16A34A' : '#4ADE80' },
          warning: { main: mode === 'light' ? '#D97706' : '#FBBF24' },
          error: { main: mode === 'light' ? '#DC2626' : '#F87171' },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#0B1120',
            paper: mode === 'light' ? '#FFFFFF' : '#111827',
          },
          text: {
            primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
            secondary: mode === 'light' ? '#64748B' : '#A8B3C7',
          },
          divider: mode === 'light' ? '#E2E8F0' : '#263247',
        },
        shape: {
          borderRadius: 10,
        },
        typography: {
          fontFamily: [
            '"Plus Jakarta Sans"',
            '"Noto Sans SC"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"PingFang SC"',
            '"Microsoft YaHei"',
            'sans-serif',
          ].join(','),
          h3: { fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.15 },
          h4: { fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
          h5: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3 },
          h6: { fontWeight: 650, letterSpacing: '-0.01em', lineHeight: 1.35 },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.6 },
          button: { textTransform: 'none', fontWeight: 650 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '*': { boxSizing: 'border-box' },
              'html, body, #root': { minHeight: '100%' },
              body: {
                minWidth: 320,
                transition: 'background-color 200ms ease, color 200ms ease',
                WebkitFontSmoothing: 'antialiased',
              },
              '::selection': {
                backgroundColor: mode === 'light' ? '#C7D2FE' : '#3730A3',
              },
              '@media (prefers-reduced-motion: reduce)': {
                '*, *::before, *::after': {
                  animationDuration: '0.01ms !important',
                  animationIterationCount: '1 !important',
                  transitionDuration: '0.01ms !important',
                  scrollBehavior: 'auto !important',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                minHeight: 44,
                borderRadius: '10px',
                padding: '9px 16px',
                boxShadow: 'none',
                transition: 'background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  boxShadow: 'none',
                },
                '&.Mui-focusVisible': {
                  boxShadow: `0 0 0 3px ${mode === 'light' ? 'rgba(79,70,229,0.24)' : 'rgba(129,140,248,0.32)'}`,
                },
              },
              containedPrimary: {
                backgroundColor: mode === 'light' ? '#4F46E5' : '#6366F1',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#4338CA' : '#4F46E5',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                width: 44,
                height: 44,
                borderRadius: '10px',
                '&.Mui-focusVisible': {
                  boxShadow: `0 0 0 3px ${mode === 'light' ? 'rgba(79,70,229,0.24)' : 'rgba(129,140,248,0.32)'}`,
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '14px',
                boxShadow: mode === 'light' ? '0 1px 2px rgba(15, 23, 42, 0.04)' : 'none',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: mode === 'light' ? '#FFFFFF' : '#111827',
                  '& fieldset': {
                    borderColor: mode === 'light' ? '#CBD5E1' : '#334155',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'light' ? '#94A3B8' : '#64748B',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 1.5,
                  },
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: { borderRadius: '16px' },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: { borderRadius: '8px', fontSize: '0.75rem' },
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
