import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
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
} from "@mui/material";
import { useLanguageContext } from "../contexts/LanguageContext";
import { supabase } from "../supabaseClient";
// 统一使用 Lucide 图标以保持高级感
import { 
  ChevronDown, 
  Sparkles, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  FileDown, 
  Copy,
  BarChart3,
  BookmarkPlus,
  Check,
  ArrowLeft
} from 'lucide-react';

function ResultPanel({ questions, matchReport, loading, isReadOnly = false, onBack }) {
  const { t, isEnglish } = useLanguageContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 内部状态处理
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // 弹窗控制和自定义标题
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  // 当生成了新报告（questions 改变）时，重置保存状态
  useEffect(() => {
    setIsSaved(false);
  }, [questions, matchReport]);

  // --- 复制逻辑 ---
  const handleCopyAll = () => {
    if (questions.length === 0) return;
    const formattedText = questions
      .map((item, index) => `Q${index + 1}: ${item.question}\nIntent: ${item.intent}\nAnswer: ${item.answer}\n`)
      .join("\n---\n\n");

    navigator.clipboard.writeText(formattedText)
      .then(() => alert(isEnglish ? "Copied!" : "复制成功！"))
      .catch((err) => console.error(err));
  };

  // --- 打开保存弹窗并初始化默认名称 ---
  const handleOpenSaveDialog = () => {
    if (isSaved) return;
    const dateStr = new Date().toLocaleDateString();
    const defaultTitle = `${matchReport?.job_title || (isEnglish ? "Interview Report" : "面试报告")} - ${dateStr}`;
    setCustomTitle(defaultTitle);
    setOpenSaveDialog(true);
  };

  // --- 修改后的保存逻辑 ---
  const handleSaveToDashboard = async () => {
    if (!customTitle.trim()) return;
    setSaveLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert(isEnglish ? "Please login first" : "请先登录");
        return;
      }

      const { error } = await supabase
        .from('reports')
        .insert([
          {
            user_id: user.id,
            job_title: customTitle, 
            match_report: matchReport,
            questions: questions,
          },
        ]);

      if (error) throw error;

      setIsSaved(true);
      setOpenSaveDialog(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(isEnglish ? "Save failed" : "保存失败");
    } finally {
      setSaveLoading(false);
    }
  };

  // --- 导出逻辑 ---
  const exportAsMarkdown = () => {
    if (questions.length === 0 && !matchReport) return;
    let mdContent = `# Interview Preparation Report\n\n`;
    
    if (matchReport) {
      mdContent += `## Match Report (Score: ${matchReport.overall_score}%)\n`;
      mdContent += `### Strengths\n${matchReport.strengths?.map(s => `- ${s}`).join('\n')}\n\n`;
      mdContent += `### Gaps\n${matchReport.gaps?.map(g => `- ${g}`).join('\n')}\n\n`;
    }

    mdContent += `## Interview Questions\n\n`;
    questions.forEach((q, i) => {
      mdContent += `### ${i+1}. ${q.question}\n- **Intent:** ${q.intent}\n- **Answer:** ${q.answer}\n\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Interview_Prep_${new Date().getTime()}.md`;
    link.click();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const renderMatchReport = () => (
    <Paper
      variant="outlined"
      sx={{ p: 4, mb: 6, borderRadius: 4, bgcolor: "background.paper", borderColor: "divider" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <BarChart3 size={24} color={theme.palette.primary.main} />
        <Typography variant="h6" fontWeight="700">{t.cvMatchReport}</Typography>
        <Chip
          label={`${t.fitScore}: ${matchReport?.overall_score}%`}
          sx={{ ml: "auto", fontWeight: "700", borderRadius: '8px', bgcolor: getScoreColor(matchReport?.overall_score), color: "#fff" }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ color: "success.main", mb: 2, display: "flex", alignItems: "center", gap: 1, fontWeight: "700" }}>
            <CheckCircle2 size={18} /> {t.keyStrengths}
          </Typography>
          <Stack spacing={1.5}>
            {matchReport?.strengths?.map((item, i) => (
              <Box key={i} sx={{ p: 2, bgcolor: isDark ? "rgba(76, 175, 80, 0.05)" : "rgba(76, 175, 80, 0.02)", borderRadius: 2, fontSize: "0.85rem", border: `1px solid ${isDark ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)"}`, color: isDark ? "#81c784" : "#2e7d32" }}>
                • {item}
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ color: "error.main", mb: 2, display: "flex", alignItems: "center", gap: 1, fontWeight: "700" }}>
            <AlertCircle size={18} /> {t.potentialGaps}
          </Typography>
          <Stack spacing={1.5}>
            {matchReport?.gaps?.map((item, i) => (
              <Box key={i} sx={{ p: 2, bgcolor: isDark ? "rgba(244, 67, 54, 0.05)" : "rgba(244, 67, 54, 0.02)", borderRadius: 2, fontSize: "0.85rem", border: `1px solid ${isDark ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.1)"}`, color: isDark ? "#e57373" : "#d32f2f" }}>
                • {item}
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4, opacity: 0.6 }} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Sparkles size={18} style={{ color: theme.palette.primary.main, marginTop: '3px' }} />
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          <strong style={{ color: theme.palette.text.primary }}>{t.aiInsight}:</strong> {matchReport?.summary}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, height: "100%", bgcolor: "background.default", p: { xs: 3, md: 8 }, pb: 12, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {(questions.length > 0 || matchReport) ? (
        <Box sx={{ width: "100%", maxWidth: "800px" }}>
          
          {/* 工具栏优化：支持返回按钮和保存按钮隐藏 */}
          <Stack direction="row" spacing={2} sx={{ mb: 6, justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              {isReadOnly && (
                <Button 
                  variant="text" 
                  startIcon={<ArrowLeft size={20} />} 
                  onClick={onBack}
                  sx={{ color: 'text.primary', fontWeight: 700, textTransform: 'none' }}
                >
                  {isEnglish ? "Back" : "返回"}
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={1.5}>
              {!isReadOnly && (
                <Button 
                  variant="text" 
                  startIcon={isSaved ? <Check size={16} /> : <BookmarkPlus size={16} />} 
                  onClick={handleOpenSaveDialog}
                  disabled={saveLoading || isSaved}
                  sx={{ 
                    color: isSaved ? 'text.disabled' : 'primary.main', 
                    fontWeight: '700',
                    '&.Mui-disabled': { color: theme.palette.text.disabled }
                  }}
                >
                  {saveLoading ? <CircularProgress size={16} color="inherit" /> : (isSaved ? (isEnglish ? "Saved" : "已保存") : (isEnglish ? "Save to Dashboard" : "保存到面板"))}
                </Button>
              )}

              <IconButton onClick={handleCopyAll} sx={{ color: 'text.secondary' }}>
                <Copy size={20} />
              </IconButton>
              
              <Button 
                variant="outlined" 
                startIcon={<FileDown size={16} />} 
                onClick={exportAsMarkdown}
                sx={{ borderRadius: '8px', borderColor: 'divider', color: 'text.primary', textTransform: 'none', fontWeight: 600 }}
              >
                {t.exportMD}
              </Button>
            </Stack>
          </Stack>

          {matchReport && renderMatchReport()}

          <Typography variant="h4" fontWeight="800" sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, letterSpacing: '-1px' }}>
            {t.interviewPrep}
            <Chip label={`${questions.length}`} sx={{ fontWeight: "700", bgcolor: "text.primary", color: "background.paper", height: 28 }} />
          </Typography>

          <Stack spacing={2.5}>
            {questions.map((item, index) => (
              <Accordion key={index} elevation={0} disableGutters sx={{ borderRadius: '12px !important', border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                  <Box sx={{ display: "flex", gap: 2.5, alignItems: "center", py: 1 }}>
                    <Typography fontWeight="800" color="text.disabled" sx={{ minWidth: 20 }}>{String(index + 1).padStart(2, '0')}</Typography>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.5 }}>{item.question}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4, pt: 0 }}>
                  <Divider sx={{ mb: 3, opacity: 0.5 }} />
                  {item.intent && (
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <Target size={16} color={theme.palette.primary.main} />
                        <Typography variant="caption" fontWeight="800" sx={{ color: "primary.main", textTransform: "uppercase" }}>{t.interviewerIntent}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.8, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 2, borderRadius: 2 }}>{item.intent}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <Lightbulb size={16} color="#ed6c02" />
                      <Typography variant="caption" fontWeight="800" sx={{ color: "#ed6c02", textTransform: "uppercase" }}>{t.suggestedAnswer}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{item.answer}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>{isEnglish ? "Name this Report" : "给这份报告取个名字"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                variant="outlined"
                placeholder={isEnglish ? "e.g. Frontend Dev - Google" : "例如：前端开发 - 字节跳动"}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setOpenSaveDialog(false)} color="inherit" sx={{ fontWeight: 600 }}>{isEnglish ? "Cancel" : "取消"}</Button>
              <Button onClick={handleSaveToDashboard} variant="contained" disabled={saveLoading || !customTitle.trim()} sx={{ fontWeight: 600, borderRadius: 2, px: 3 }}>
                {saveLoading ? <CircularProgress size={20} /> : (isEnglish ? "Save" : "确认保存")}
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ height: 100 }} />
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", maxWidth: "450px" }}>
          {loading ? (
            <Stack alignItems="center" spacing={3}>
              <CircularProgress size={48} thickness={5} sx={{ color: 'text.primary' }} />
              <Box>
                <Typography variant="h6" fontWeight="700">{isEnglish ? "Analyzing..." : "分析中..."}</Typography>
                <Typography variant="body2" color="text.secondary">正在根据你的简历和 JD 编写面试攻略</Typography>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ opacity: 0.4 }}>
              <Sparkles size={64} strokeWidth={1} style={{ marginBottom: '24px' }} />
              <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-1px', mb: 1 }}>{t.readyToStart}</Typography>
              <Typography variant="body2">{t.fillLeftPanel}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ResultPanel;