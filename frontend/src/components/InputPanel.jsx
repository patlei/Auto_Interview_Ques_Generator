import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  IconButton,
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Sparkles, UploadCloud, FileText, Trash2 } from 'lucide-react';
import { useLanguageContext } from "../contexts/LanguageContext";

function InputPanel({
  resume,
  handleUpload,
  handleRemoveFile,
  jd,
  setJd,
  interviewer,
  setInterviewer,
  handleGenerate,
  loading,
}) {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 统一样式：输入框背景色和圆角
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
      fontSize: '0.9rem',
      "& fieldset": {
        borderColor: "divider",
      },
    },
  };

  return (
    <Box
      sx={{
        width: "35%",
        minWidth: "400px",
        height: "100%",
        bgcolor: "background.paper", 
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        p: 4,
        overflowY: "auto",
        zIndex: 2,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            bgcolor: "text.primary",
            color: "background.paper",
            p: 1,
            borderRadius: 2,
            display: "flex",
          }}
        >
          <Sparkles size={20} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
            {t.brandName || "InteviewApe"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            AI-Powered Tool
          </Typography>
        </Box>
      </Box>

      {/* Form Inputs */}
      <Stack spacing={4}>
        {/* 1. Resume Upload */}
        <Box>
          <Typography variant="subtitle2" fontWeight="800" color="text.primary" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
            {t.step1 || "1. Upload Resume (Resume/CV)"}
          </Typography>
          {!resume ? (
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{
                height: 110,
                borderStyle: "dashed",
                borderWidth: 1.5,
                borderColor: "divider",
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                textTransform: "none",
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                },
              }}
            >
              <UploadCloud size={24} strokeWidth={1.5} style={{ marginBottom: '8px', color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                {t.clickToUpload}
              </Typography>
              <input type="file" hidden onChange={handleUpload} accept=".pdf,.docx,.doc,.txt" />
            </Button>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                borderColor: "divider",
              }}
            >
              <FileText size={20} style={{ marginRight: '12px' }} />
              <Box sx={{ flexGrow: 1, overflow: "hidden", mr: 1 }}>
                <Typography variant="subtitle2" fontWeight="700" noWrap>
                  {resume.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(resume.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleRemoveFile} color="error">
                <Trash2 size={16} />
              </IconButton>
            </Paper>
          )}
        </Box>

        {/* 2. JD Input */}
        <Box>
          <Typography variant="subtitle2" fontWeight="800" color="text.primary" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
            {t.step2 || "2. Job Description (JD)"}
          </Typography>
          <TextField
            placeholder={t.jdPlaceholder || "Paste the JD content here..."}
            fullWidth
            multiline
            minRows={6}
            maxRows={10}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            sx={textFieldStyle}
          />
        </Box>

        {/* 3. Interviewer Info */}
        <Box>
          <Typography variant="subtitle2" fontWeight="800" color="text.primary" sx={{ mb: 1.5, fontSize: '0.9rem' }}>
            {t.step3 || "3. Interviewer Preferences (Optional)"}
          </Typography>
          <TextField
            placeholder={t.prefPlaceholder || "E.g., CTO, focuses on system design"}
            fullWidth
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
            sx={textFieldStyle}
          />
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: 3,
            fontWeight: "800",
            fontSize: "1rem",
            letterSpacing: '0.5px',
            bgcolor: "text.primary",
            color: "background.paper",
            boxShadow: isDark ? 'none' : '0 10px 20px rgba(0,0,0,0.1)',
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)",
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s',
            mt: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `✨ ${t.generateQuestions || "GENERATE QUESTIONS"}`
          )}
        </Button>
      </Stack>
    </Box>
  );
}

export default InputPanel;