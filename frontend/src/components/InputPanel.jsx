import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AutoAwesome as AutoAwesomeIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  DeleteOutline as DeleteIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from "@mui/icons-material";


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
  return (
    <Box
      sx={{
        width: "35%",
        minWidth: "400px",
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        p: 4,
        overflowY: "auto",
        boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
        zIndex: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 1,
            borderRadius: 2,
            display: "flex",
          }}
        >
          <AutoAwesomeIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="800" color="#1a1a1a">
            Interview Generator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            AI-Powered Tool
          </Typography>
        </Box>
      </Box>

      {/* Form Inputs */}
      <Stack spacing={4}>
        {/* A. Resume Upload */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            1. Upload Resume (Resume/CV)
          </Typography>
          {!resume ? (
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{
                height: 100,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "grey.300",
                bgcolor: "grey.50",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                textTransform: "none",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
            >
              <CloudUploadIcon color="primary" sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Click to upload file (PDF/Word)
              </Typography>
              <input
                id="resume-upload-input"
                type="file"
                hidden
                onChange={handleUpload}
                accept=".pdf,.docx,.doc,.txt"
              />
            </Button>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                bgcolor: "primary.50",
                borderColor: "primary.main",
              }}
            >
              <FileIcon color="primary" sx={{ mr: 1.5 }} />
              <Box sx={{ flexGrow: 1, overflow: "hidden", mr: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {resume.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(resume.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              <Tooltip title="Preview">
                <IconButton
                  size="small"
                  href={URL.createObjectURL(resume)}
                  target="_blank"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
          )}
        </Box>

        {/* B. JD Input */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            2. Job Description (JD)
          </Typography>
          <TextField
            placeholder="Paste the JD content here..."
            fullWidth
            multiline
            minRows={6}
            maxRows={12}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#fafafa",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1 }}>
                  <DescriptionIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* C. Interviewer Info */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            3. Interviewer Preferences (Optional)
          </Typography>
          <TextField
            placeholder="E.g., CTO, focuses on system design"
            fullWidth
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#fafafa",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: 3,
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 8px 20px rgba(25, 118, 210, 0.25)",
            mt: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" /> Generating...
            </Box>
          ) : (
            "✨ Generate Questions"
          )}
        </Button>
      </Stack>
    </Box>
  );
}

export default InputPanel;