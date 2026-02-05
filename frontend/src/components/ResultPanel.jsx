import React from "react";
import {
  Box,
  CssBaseline,
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
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowRight as ArrowRightIcon,
  AutoAwesome as AutoAwesomeIcon,
  ExpandMore as ExpandMoreIcon,
  TipsAndUpdates as TipsIcon,
  AdsClick as TargetIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as GapIcon,
  AssessmentOutlined as ReportIcon,
  ContentCopy as CopyIcon,
  Description as MdIcon,
} from "@mui/icons-material";

/**
 * ResultPanel Component
 * @param {Array} questions - List of generated question objects
 * @param {Object} matchReport - Analysis object (score, strengths, gaps, summary)
 * @param {Boolean} loading - Loading state from App.js
 */
function ResultPanel({ questions, matchReport, loading }) {
  
  // --- Feature 1: One-click Copy All Questions & Answers ---
  const handleCopyAll = () => {
    if (questions.length === 0) return;
    
    const formattedText = questions
      .map((item, index) => {
        return `Question ${index + 1}: ${item.question}\nIntent: ${item.intent}\nSuggested Answer: ${item.answer}\n`;
      })
      .join("\n" + "=".repeat(30) + "\n\n");

    navigator.clipboard.writeText(formattedText)
      .then(() => alert("Copied all questions and answers to clipboard!"))
      .catch((err) => {
        console.error("Copy failed", err);
        alert("Copy failed, please try again.");
      });
  };

  // --- Feature 2: Export as Markdown (Best for Chinese Support) ---
  const exportAsMarkdown = () => {
    if (questions.length === 0 && !matchReport) return;

    let mdContent = `# Interview Preparation Report\n\n`;
    
    if (matchReport) {
      mdContent += `## CV Match Analysis\n`;
      mdContent += `- **Overall Score**: ${matchReport.overall_score}%\n`;
      mdContent += `- **Summary**: ${matchReport.summary}\n\n`;
      mdContent += `### Strengths\n${matchReport.strengths.map(s => `- ${s}`).join("\n")}\n\n`;
      mdContent += `### Gaps\n${matchReport.gaps.map(g => `- ${g}`).join("\n")}\n\n`;
    }

    mdContent += `## Generated Questions\n\n`;
    questions.forEach((item, index) => {
      mdContent += `### ${index + 1}. ${item.question}\n`;
      mdContent += `**Intent:** ${item.intent}\n\n`;
      mdContent += `**Suggested Answer:**\n${item.answer}\n\n---\n\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Interview_Prep_${new Date().getTime()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#2e7d32"; // Success Green
    if (score >= 60) return "#ed6c02"; // Warning Orange
    return "#d32f2f"; // Error Red
  };

  const renderMatchReport = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 5,
        borderRadius: 4,
        bgcolor: "white",
        border: "1px solid #eef2f6",
        animation: "fadeIn 0.8s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <ReportIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">CV Match Report</Typography>
        <Chip
          label={`Fit Score: ${matchReport?.overall_score}%`}
          sx={{ 
            ml: "auto", 
            fontWeight: "bold", 
            borderRadius: 1.5,
            bgcolor: getScoreColor(matchReport?.overall_score),
            color: "white"
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ color: "success.main", mb: 1.5, display: "flex", alignItems: "center", gap: 0.5, fontWeight: "bold" }}>
            <SuccessIcon fontSize="small" /> KEY STRENGTHS
          </Typography>
          <Stack spacing={1}>
            {matchReport?.strengths?.map((item, i) => (
              <Box key={i} sx={{ p: 1.5, bgcolor: "#f6ffed", borderRadius: 2, fontSize: "0.85rem", border: "1px solid #b7eb8f", color: "#237804" }}>
                ✓ {item}
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ color: "error.main", mb: 1.5, display: "flex", alignItems: "center", gap: 0.5, fontWeight: "bold" }}>
            <GapIcon fontSize="small" /> POTENTIAL GAPS
          </Typography>
          <Stack spacing={1}>
            {matchReport?.gaps?.map((item, i) => (
              <Box key={i} sx={{ p: 1.5, bgcolor: "#fff2f0", borderRadius: 2, fontSize: "0.85rem", border: "1px solid #ffccc7", color: "#a8071a" }}>
                ⚠ {item}
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2.5 }} />
      <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", lineHeight: 1.6 }}>
        <strong>AI Insight:</strong> {matchReport?.summary}
      </Typography>
    </Paper>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100%",
        bgcolor: "#f8f9fa",
        p: { xs: 3, md: 6 },
        pb: 12,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: (questions.length > 0 || matchReport) ? "flex-start" : "center",
      }}
    >
      <CssBaseline />

      {(questions.length > 0 || matchReport) ? (
        <Box sx={{ width: "100%", maxWidth: "850px", animation: "fadeIn 0.5s" }}>
          
          {/* Action Toolbar */}
          <Stack direction="row" spacing={2} sx={{ mb: 4, justifyContent: "flex-end" }}>
            <Tooltip title="Copy all to clipboard">
              <Button variant="outlined" startIcon={<CopyIcon />} onClick={handleCopyAll} size="small">
                Copy All
              </Button>
            </Tooltip>
            <Tooltip title="Download Markdown (.md)">
              <Button variant="contained" color="secondary" startIcon={<MdIcon />} onClick={exportAsMarkdown} size="small">
                Export MD
              </Button>
            </Tooltip>
          </Stack>

          {matchReport && renderMatchReport()}

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            🎯 Interview Prep
            <Chip 
              label={`${questions.length} Questions`} 
              color="primary" 
              sx={{ fontWeight: "bold", borderRadius: 2 }} 
            />
          </Typography>

          <Stack spacing={2}>
            {questions.map((item, index) => (
              <Accordion
                key={index}
                elevation={0}
                disableGutters
                sx={{
                  borderRadius: 3,
                  border: "1px solid #eef2f6",
                  overflow: "hidden",
                  "&:before": { display: "none" }, 
                  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.05)", borderColor: "primary.light" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{ px: 3, py: 1 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ minWidth: 28, height: 28, borderRadius: "50%", bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold", mt: 0.5 }}>
                      {index + 1}
                    </Box>
                    <Typography variant="h6" fontSize="1.05rem" lineHeight={1.6} fontWeight={500}>
                      {item.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, bgcolor: "#ffffff" }}>
                  {item.intent && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f7ff", borderRadius: 2, borderLeft: "4px solid #1976d2" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <TargetIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                        <Typography variant="caption" fontWeight="bold" sx={{ color: "#1976d2", letterSpacing: 1, textTransform: "uppercase" }}>
                          Interviewer Intent
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                        {item.intent}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ px: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <TipsIcon sx={{ fontSize: 18, color: "orange" }} />
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "orange", letterSpacing: 0.5 }}>
                        SUGGESTED ANSWER
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                      {item.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
          <Box sx={{ height: "120px", width: "100%" }} />
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", color: "text.secondary", maxWidth: "400px" }}>
          {loading ? (
            <Box>
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">Analyzing Match...</Typography>
              <Typography sx={{ mt: 1 }}>Synthesizing personalized notes for your interview.</Typography>
            </Box>
          ) : (
            <Box sx={{ opacity: 0.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <AutoAwesomeIcon sx={{ fontSize: 80, mb: 3, color: "#ccc" }} />
              <Typography variant="h5" fontWeight="bold" color="text.disabled" gutterBottom>Ready to Start?</Typography>
              <Typography variant="body1" color="text.disabled">Fill out the left panel to generate your prep kit.</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ResultPanel;