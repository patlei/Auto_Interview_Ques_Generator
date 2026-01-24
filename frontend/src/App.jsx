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

  /**
   * 核心修复逻辑：强力解析后端数据
   * 无论后端传过来的是 String, 嵌套 String 还是 Object，都统一转为对象数组
   */
  const parseQuestionsData = (data) => {
    let result = data;

    // 1. 如果数据是字符串，尝试解析 JSON
    if (typeof result === 'string') {
      try {
        const cleanJson = result.replace(/```json|```/g, "").trim();
        result = JSON.parse(cleanJson);
      } catch (e) {
        console.error("String parse error:", e);
        return [];
      }
    }

    // 2. 解决你遇到的问题：数组第一个元素是整串 JSON 字符串
    if (Array.isArray(result) && result.length === 1 && typeof result[0] === 'string') {
      try {
        result = JSON.parse(result[0]);
      } catch (e) {
        console.error("Nested string parse error:", e);
      }
    }

    // 3. 确保返回的是数组
    return Array.isArray(result) ? result : [];
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
      
      let rawData = data.questions;

      // 如果 rawData 是字符串，或者是嵌套在数组里的字符串，进行循环解析
      while (typeof rawData === 'string' || (Array.isArray(rawData) && rawData.length === 1 && typeof rawData[0] === 'string')) {
        try {
          const target = Array.isArray(rawData) ? rawData[0] : rawData;
          // 清理可能存在的 Markdown 标签
          const cleanJson = target.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          
          // 如果解析后的结果和之前一样（死循环保护），则跳出
          if (JSON.stringify(parsed) === JSON.stringify(rawData)) break;
          rawData = parsed;
        } catch (e) {
          console.error("解析失败:", e);
          break;
        }
      }

      // 确保最终一定是数组
      const finalQuestions = Array.isArray(rawData) ? rawData : [];
      console.log("最终解析出的数据：", finalQuestions);
      setQuestions(finalQuestions);
      
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
        flexDirection: "row", 
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
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

      <ResultPanel 
        questions={questions} 
        loading={loading} 
      />
    </Box>
  );
}

export default App;