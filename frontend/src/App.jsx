import React, { useState } from "react";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (!resume || !jd) {
      alert("请上传简历并填写职位描述");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cv", resume); // 后端的字段名是 cv
      formData.append("jd", jd);
      formData.append("interviewer_info", interviewer);

      const res = await fetch("http://127.0.0.1:8000/generate_questions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("请求失败");

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      alert("生成失败，请检查后端是否运行");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        面试题生成器
      </Typography>

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        上传简历
        <input type="file" hidden onChange={handleUpload} />
      </Button>
      {resume && <Typography>已选择: {resume.name}</Typography>}

      <TextField
        label="职位描述 (JD)"
        fullWidth
        multiline
        rows={4}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        sx={{ mb: 2, mt: 2 }}
      />

      <TextField
        label="面试官信息"
        fullWidth
        value={interviewer}
        onChange={(e) => setInterviewer(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loading}
        fullWidth
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "生成面试题"}
      </Button>

      {/* 显示生成的面试题 */}
      {questions.length > 0 && (
        <div>
          <Typography variant="h6" gutterBottom>
            生成的面试题：
          </Typography>
          <ol>
            {questions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </Container>
  );
}

export default App;
