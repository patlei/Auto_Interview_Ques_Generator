import React from "react";
import {
  Box,
  CssBaseline,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  KeyboardArrowRight as ArrowRightIcon,
  AutoAwesome as AutoAwesomeIcon,
  ExpandMore as ExpandMoreIcon,
  TipsAndUpdates as TipsIcon,
} from "@mui/icons-material";

function ResultPanel({ questions, loading }) {
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
        justifyContent: questions.length > 0 ? "flex-start" : "center",
      }}
    >
      <CssBaseline />

      {questions.length > 0 ? (
        // Case A: Show Results
        <Box
          sx={{ width: "100%", maxWidth: "800px", animation: "fadeIn 0.5s" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}
          >
            🎯 Generated Results
            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                bgcolor: "#e3f2fd",
                color: "primary.main",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              {questions.length} Qs
            </Typography>
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
                  "&:before": { display: "none" }, // 去除默认分割线
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    borderColor: "primary.light",
                  },
                }}
              >
                {/* 问题部分 */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                  sx={{
                    px: 3,
                    py: 1,
                    "&.Mui-expanded": {
                      bgcolor: "rgba(25, 118, 210, 0.02)",
                      borderBottom: "1px solid #f0f0f0",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        minWidth: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        mt: 0.5,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      variant="h6"
                      fontSize="1.05rem"
                      lineHeight={1.6}
                      fontWeight={500}
                    >
                      {item.question}
                    </Typography>
                  </Box>
                </AccordionSummary>

                {/* 参考回答部分 */}
                <AccordionDetails sx={{ p: 3, bgcolor: "#ffffff" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <TipsIcon sx={{ fontSize: 18, color: "orange" }} />
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ color: "orange", letterSpacing: 0.5 }}
                    >
                      SUGGESTED ANSWER
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      fontSize: "0.95rem",
                      whiteSpace: "pre-wrap", // 保留换行格式
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
          
          <Box sx={{ height: "120px", width: "100%" }} />
        </Box>
      ) : (
        // Case B: Empty State (保持不变，仅更新 loading 提示)
        <Box
          sx={{
            textAlign: "center",
            color: "text.secondary",
            maxWidth: "400px",
          }}
        >
          {loading ? (
            <Box>
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                AI is generating QA...
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Synthesizing model answers based on your experience...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                opacity: 0.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ArrowRightIcon
                  sx={{ fontSize: 40, transform: "rotate(180deg)" }}
                />
                <Typography variant="button">
                  Please operate on the left
                </Typography>
              </Box>

              <AutoAwesomeIcon sx={{ fontSize: 80, mb: 3, color: "#ccc" }} />
              <Typography
                variant="h5"
                fontWeight="bold"
                color="text.disabled"
                gutterBottom
              >
                Ready to start?
              </Typography>
              <Typography variant="body1" color="text.disabled">
                Upload resume and fill JD on the left<br />
                AI will generate questions & answers
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ResultPanel;