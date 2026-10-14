import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Divider,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useLanguageContext } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import {
  ChevronDown,
  Sparkles,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Copy,
  BarChart3,
  BookmarkPlus,
  Check,
  ArrowLeft,
  ClipboardCheck,
} from 'lucide-react';

function ResultPanel({ questions, matchReport, loading, isReadOnly = false, onBack }) {
  const { t, isEnglish } = useLanguageContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [copyNotice, setCopyNotice] = useState(false);

  useEffect(() => {
    setIsSaved(false);
  }, [questions, matchReport]);

  const handleCopyAll = () => {
    if (questions.length === 0) return;
    const formattedText = questions
      .map((item, index) => `Q${index + 1}: ${item.question}\nIntent: ${item.intent}\nAnswer: ${item.answer}\n`)
      .join('\n---\n\n');

    navigator.clipboard.writeText(formattedText)
      .then(() => setCopyNotice(true))
      .catch((error) => console.error(error));
  };

  const handleOpenSaveDialog = () => {
    if (isSaved) return;
    const dateStr = new Date().toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN');
    const defaultTitle = `${matchReport?.job_title || (isEnglish ? 'Interview Report' : '面试报告')} - ${dateStr}`;
    setCustomTitle(defaultTitle);
    setOpenSaveDialog(true);
  };

  const handleSaveToDashboard = async () => {
    if (!customTitle.trim()) return;
    setSaveLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert(isEnglish ? 'Please login first' : '请先登录');
        return;
      }

      const { error } = await supabase.from('reports').insert([
        {
          user_id: user.id,
          job_title: customTitle,
          match_report: matchReport,
          questions,
        },
      ]);
      if (error) throw error;

      setIsSaved(true);
      setOpenSaveDialog(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(isEnglish ? 'Save failed' : '保存失败');
    } finally {
      setSaveLoading(false);
    }
  };

  const exportAsMarkdown = () => {
    if (questions.length === 0 && !matchReport) return;
    let mdContent = '# Interview Preparation Report\n\n';

    if (matchReport) {
      mdContent += `## Match Report (Score: ${matchReport.overall_score}%)\n`;
      mdContent += `### Strengths\n${matchReport.strengths?.map((item) => `- ${item}`).join('\n')}\n\n`;
      mdContent += `### Gaps\n${matchReport.gaps?.map((item) => `- ${item}`).join('\n')}\n\n`;
    }

    mdContent += '## Interview Questions\n\n';
    questions.forEach((question, index) => {
      mdContent += `### ${index + 1}. ${question.question}\n- **Intent:** ${question.intent}\n- **Answer:** ${question.answer}\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Interview_Prep_${new Date().getTime()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const score = Math.max(0, Math.min(100, Number(matchReport?.overall_score) || 0));
  const scoreColor = score >= 80 ? theme.palette.success.main : score >= 60 ? theme.palette.warning.main : theme.palette.error.main;

  const renderMatchReport = () => (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '16px', borderColor: 'divider' }}>
      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center" sx={{ mb: 3.5 }}>
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'grid', placeItems: 'center' }}>
              <BarChart3 size={19} aria-hidden="true" />
            </Box>
            <Typography component="h2" variant="h5">{t.cvMatchReport}</Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
            {matchReport?.summary || (isEnglish ? 'Your experience has been compared with the target role.' : '已将你的经历与目标岗位要求进行综合对比。')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative', width: 112, height: 112, flexShrink: 0 }}>
              <CircularProgress variant="determinate" value={100} size={112} thickness={5} sx={{ color: alpha(scoreColor, 0.14), position: 'absolute' }} />
              <CircularProgress variant="determinate" value={score} size={112} thickness={5} sx={{ color: scoreColor, position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
              <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 750, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{score}%</Typography>
                  <Typography variant="caption" color="text.secondary">{t.fitScore}</Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', p: 2.5, borderRadius: '12px', bgcolor: alpha(theme.palette.success.main, isDark ? 0.08 : 0.055), border: `1px solid ${alpha(theme.palette.success.main, 0.18)}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: 'success.main' }}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>{t.keyStrengths}</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {matchReport?.strengths?.map((item, index) => (
                <Stack key={index} direction="row" spacing={1.25} alignItems="flex-start">
                  <CheckCircle2 size={15} color={theme.palette.success.main} style={{ marginTop: 4, flexShrink: 0 }} aria-hidden="true" />
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', p: 2.5, borderRadius: '12px', bgcolor: alpha(theme.palette.warning.main, isDark ? 0.08 : 0.055), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: 'warning.main' }}>
              <AlertTriangle size={18} aria-hidden="true" />
              <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>{t.potentialGaps}</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {matchReport?.gaps?.map((item, index) => (
                <Stack key={index} direction="row" spacing={1.25} alignItems="flex-start">
                  <AlertTriangle size={15} color={theme.palette.warning.main} style={{ marginTop: 4, flexShrink: 0 }} aria-hidden="true" />
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box
      component="section"
      aria-label={isEnglish ? 'Interview analysis results' : '面试分析结果'}
      sx={{
        flexGrow: 1,
        minWidth: 0,
        width: '100%',
        height: { xs: 'auto', md: '100%' },
        minHeight: { xs: '70dvh', md: 0 },
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3, lg: 5 },
        pb: { xs: 6, md: 10 },
        overflowY: { xs: 'visible', md: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {(questions.length > 0 || matchReport) ? (
        <Box sx={{ width: '100%', maxWidth: 960 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'sticky',
              top: { xs: 60, sm: 64, md: 0 },
              zIndex: 10,
              minHeight: 70,
              mb: 3,
              py: 1.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.background.default, 0.92),
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box>
              {isReadOnly && (
                <Button variant="text" startIcon={<ArrowLeft size={18} aria-hidden="true" />} onClick={onBack} sx={{ color: 'text.primary' }}>
                  {isEnglish ? 'Back' : '返回'}
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={0.75} alignItems="center">
              {!isReadOnly && (
                <Button
                  variant="text"
                  startIcon={isSaved ? <Check size={17} aria-hidden="true" /> : <BookmarkPlus size={17} aria-hidden="true" />}
                  onClick={handleOpenSaveDialog}
                  disabled={saveLoading || isSaved}
                  sx={{ px: { xs: 1, sm: 1.5 } }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {saveLoading ? (isEnglish ? 'Saving' : '保存中') : isSaved ? (isEnglish ? 'Saved' : '已保存') : (isEnglish ? 'Save' : '保存报告')}
                  </Box>
                </Button>
              )}

              <Tooltip title={isEnglish ? 'Copy all questions' : '复制全部题目'}>
                <IconButton onClick={handleCopyAll} aria-label={isEnglish ? 'Copy all questions' : '复制全部题目'} sx={{ color: 'text.secondary' }}>
                  <Copy size={19} />
                </IconButton>
              </Tooltip>

              <Button variant="outlined" startIcon={<FileDown size={17} aria-hidden="true" />} onClick={exportAsMarkdown} sx={{ color: 'text.primary', borderColor: 'divider', px: { xs: 1, sm: 1.5 } }}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t.exportMD}</Box>
              </Button>
            </Stack>
          </Stack>

          {matchReport && renderMatchReport()}

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1} sx={{ mb: 2.5 }}>
            <Box>
              <Typography component="h2" variant="h5" sx={{ mb: 0.5 }}>{t.interviewPrep}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isEnglish ? `${questions.length} questions tailored to this role` : `根据岗位定制的 ${questions.length} 道题目`}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1.5}>
            {questions.map((item, index) => (
              <Accordion
                key={index}
                elevation={0}
                disableGutters
                sx={{
                  borderRadius: '12px !important',
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: alpha(theme.palette.primary.main, 0.35), boxShadow: isDark ? 'none' : '0 8px 24px rgba(15,23,42,0.05)' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} aria-hidden="true" />}
                  aria-controls={`question-${index}-content`}
                  id={`question-${index}-header`}
                  sx={{ px: { xs: 2, sm: 2.5 }, py: 0.5, '& .MuiAccordionSummary-content': { my: 1.5 } }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', minWidth: 0 }}>
                    <Box sx={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: '9px', bgcolor: alpha(theme.palette.primary.main, 0.09), color: 'primary.main', fontSize: '0.75rem', fontWeight: 750, flexShrink: 0 }}>
                      {String(index + 1).padStart(2, '0')}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 650, lineHeight: 1.55, overflowWrap: 'anywhere' }}>{item.question}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails id={`question-${index}-content`} sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 0 }}>
                  <Divider sx={{ mb: 3 }} />
                  {item.intent && (
                    <Box sx={{ mb: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25, color: 'primary.main' }}>
                        <Target size={17} aria-hidden="true" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>{t.interviewerIntent}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75, bgcolor: alpha(theme.palette.primary.main, isDark ? 0.07 : 0.045), p: 2, borderRadius: '10px' }}>
                        {item.intent}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25, color: 'warning.main' }}>
                      <Lightbulb size={17} aria-hidden="true" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>{t.suggestedAnswer}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                      {item.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 560, my: 'auto', py: { xs: 7, md: 4 }, textAlign: 'center' }}>
          {loading ? (
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: '16px' }}>
              <Box sx={{ width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: '14px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mx: 'auto', mb: 2.5 }}>
                <Sparkles size={24} aria-hidden="true" />
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{isEnglish ? 'Building your interview plan' : '正在生成面试方案'}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isEnglish ? 'Analyzing the role, matching your experience, and preparing questions.' : '正在分析岗位、匹配经历并生成针对性问题。'}
              </Typography>
              <LinearProgress sx={{ height: 7, borderRadius: '999px', '& .MuiLinearProgress-bar': { borderRadius: '999px' } }} />
            </Paper>
          ) : (
            <Box>
              <Box sx={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: '18px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mx: 'auto', mb: 2.5 }}>
                <ClipboardCheck size={30} aria-hidden="true" />
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>{t.readyToStart}</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 430, mx: 'auto' }}>{t.fillLeftPanel}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={{ xs: 1, sm: 2 }} sx={{ mt: 3.5, color: 'text.secondary' }}>
                {[
                  isEnglish ? 'Upload resume' : '上传简历',
                  isEnglish ? 'Add target role' : '填写目标岗位',
                  isEnglish ? 'Get tailored plan' : '获取定制方案',
                ].map((label, index) => (
                  <Stack key={label} direction="row" spacing={0.75} alignItems="center" justifyContent="center">
                    <Box sx={{ width: 22, height: 22, borderRadius: '7px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 750 }}>{index + 1}</Box>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 750 }}>{isEnglish ? 'Name this report' : '给这份报告命名'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label={isEnglish ? 'Report name' : '报告名称'}
            placeholder={isEnglish ? 'e.g. Frontend Developer - Google' : '例如：前端开发 - 字节跳动'}
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenSaveDialog(false)} color="inherit">{isEnglish ? 'Cancel' : '取消'}</Button>
          <Button onClick={handleSaveToDashboard} variant="contained" disabled={saveLoading || !customTitle.trim()}>
            {saveLoading ? <CircularProgress size={20} color="inherit" /> : (isEnglish ? 'Save report' : '保存报告')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copyNotice}
        autoHideDuration={3000}
        onClose={() => setCopyNotice(false)}
        message={isEnglish ? 'Questions copied' : '题目已复制'}
      />
    </Box>
  );
}

export default ResultPanel;
