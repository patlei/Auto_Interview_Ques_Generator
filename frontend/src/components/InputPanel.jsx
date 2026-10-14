import React from 'react';
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
} from '@mui/material';
import { UploadCloud, FileText, Trash2, WandSparkles } from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';

function StepHeading({ number, title, optional }) {
  const { isEnglish } = useLanguageContext();

  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
      <Box
        sx={{
          width: 26,
          height: 26,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '8px',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontSize: '0.75rem',
          fontWeight: 750,
          flexShrink: 0,
        }}
      >
        {number}
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>
      {optional && (
        <Typography variant="caption" color="text.secondary">
          {isEnglish ? 'Optional' : '可选'}
        </Typography>
      )}
    </Stack>
  );
}

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
  const { t, isEnglish } = useLanguageContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const submitForm = (event) => {
    event.preventDefault();
    handleGenerate();
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', md: 400, lg: 420 },
        minWidth: { md: 400, lg: 420 },
        height: { xs: 'auto', md: '100%' },
        bgcolor: 'background.paper',
        borderRight: { md: `1px solid ${theme.palette.divider}` },
        borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
        display: 'flex',
        flexDirection: 'column',
        overflowY: { xs: 'visible', md: 'auto' },
      }}
    >
      <Box
        component="form"
        onSubmit={submitForm}
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2.5, sm: 3, md: 3.5 },
        }}
      >
        <Box sx={{ mb: 3.5 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 0.75 }}>
            {isEnglish ? 'Create an interview plan' : '创建面试方案'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEnglish
              ? 'Add your resume and target role. AI will build a focused preparation plan.'
              : '添加简历和目标岗位，AI 将生成针对性的面试准备方案。'}
          </Typography>
        </Box>

        <Stack spacing={3.25}>
          <Box>
            <StepHeading number="1" title={isEnglish ? 'Upload resume' : '上传个人简历'} />
            {!resume ? (
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  minHeight: 112,
                  borderStyle: 'dashed',
                  borderWidth: 1.5,
                  borderColor: 'divider',
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'text.secondary',
                  '&:hover': { borderStyle: 'dashed', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(129,140,248,0.07)' : '#EEF2FF' },
                }}
              >
                <UploadCloud size={24} strokeWidth={1.7} aria-hidden="true" />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.primary', fontWeight: 650 }}>
                  {t.clickToUpload}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.25 }}>
                  PDF、DOCX、DOC、TXT
                </Typography>
                <input id="resume-upload-input" type="file" hidden onChange={handleUpload} accept=".pdf,.docx,.doc,.txt" />
              </Button>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: isDark ? 'rgba(129,140,248,0.06)' : '#F8FAFC',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: '10px', bgcolor: isDark ? 'rgba(129,140,248,0.14)' : '#EEF2FF', color: 'primary.main', mr: 1.5, flexShrink: 0 }}>
                  <FileText size={19} aria-hidden="true" />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 650 }} noWrap title={resume.name}>
                    {resume.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(resume.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  aria-label={isEnglish ? 'Remove resume' : '移除简历'}
                  sx={{ color: 'error.main' }}
                >
                  <Trash2 size={17} />
                </IconButton>
              </Paper>
            )}
          </Box>

          <Box>
            <StepHeading number="2" title={isEnglish ? 'Job description' : '职位描述'} />
            <TextField
              aria-label={isEnglish ? 'Job description' : '职位描述'}
              placeholder={t.jdPlaceholder}
              fullWidth
              multiline
              minRows={5}
              maxRows={9}
              value={jd}
              onChange={(event) => setJd(event.target.value)}
              required
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '1rem', sm: '0.9rem' }, lineHeight: 1.65 } }}
            />
          </Box>

          <Box>
            <StepHeading number="3" title={isEnglish ? 'Interviewer preference' : '面试官偏好'} optional />
            <TextField
              aria-label={isEnglish ? 'Interviewer preference' : '面试官偏好'}
              placeholder={t.prefPlaceholder}
              fullWidth
              value={interviewer}
              onChange={(event) => setInterviewer(event.target.value)}
              sx={{ '& .MuiInputBase-input': { fontSize: { xs: '1rem', sm: '0.9rem' } } }}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 'auto',
            pt: 3.5,
            position: { md: 'sticky' },
            bottom: 0,
            bgcolor: 'background.paper',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={!loading ? <WandSparkles size={19} aria-hidden="true" /> : null}
            sx={{ minHeight: 50, fontSize: '0.95rem' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : t.generateQuestions}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.25 }}>
            {isEnglish ? 'Your files are used only for this analysis.' : '文件仅用于本次分析。'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default InputPanel;
