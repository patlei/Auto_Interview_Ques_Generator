import React, { useState } from "react";
import { Box } from "@mui/material";

import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    const fileInput = document.getElementById("resume-upload-input");
    if (fileInput) fileInput.value = "";
  };

  const handleGenerate = async () => {
    if (!resume || !jd) {
      alert("Please upload a resume and fill in the Job Description.");
      return;
    }

    setLoading(true);
    setQuestions([]);
    try {
      const formData = new FormData();
      formData.append("cv", resume);
      formData.append("jd", jd);
      formData.append("interviewer_info", interviewer);

      const res = await fetch("http://127.0.0.1:8000/generate_questions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      alert("Generation failed, please check if the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row", // 依然强制左右横排
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* 1. 左侧组件: 传入输入框需要的 props */}
      <InputPanel
        resume={resume}
        handleUpload={handleUpload}
        handleRemoveFile={handleRemoveFile}
        jd={jd}
        setJd={setJd}
        interviewer={interviewer}
        setInterviewer={setInterviewer}
        handleGenerate={handleGenerate}
        loading={loading}
      />

      {/* 2. 右侧组件: 传入结果展示需要的 props */}
      <ResultPanel 
        questions={questions} 
        loading={loading} 
      />
    </Box>
  );
}

export default App;