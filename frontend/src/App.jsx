import React, { useState } from "react";
import { Box } from "@mui/material";

import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [questions, setQuestions] = useState([]);
  
  // NEW: State to store the CV Match Report data
  const [matchReport, setMatchReport] = useState(null);
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
   * Helper function to handle potential stringified JSON issues
   * (Ensures the data is a proper object/array)
   */
  const deepParse = (data) => {
    let result = data;
    if (typeof result === 'string') {
      try {
        const cleanJson = result.replace(/```json|```/g, "").trim();
        result = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Deep parse error:", e);
      }
    }
    return result;
  };

  const handleGenerate = async () => {
    if (!resume || !jd) {
      alert("Please upload a resume and fill in the Job Description.");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setMatchReport(null); // Reset previous report
    
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
      
      // Handle the nested structure: data.questions and data.match_report
      let rawQuestions = data.questions;
      let rawReport = data.match_report;

      // Recursive cleanup for questions if AI returns them as stringified JSON
      while (typeof rawQuestions === 'string' || (Array.isArray(rawQuestions) && rawQuestions.length === 1 && typeof rawQuestions[0] === 'string')) {
        try {
          const target = Array.isArray(rawQuestions) ? rawQuestions[0] : rawQuestions;
          const cleanJson = target.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          if (JSON.stringify(parsed) === JSON.stringify(rawQuestions)) break;
          rawQuestions = parsed;
        } catch (e) {
          console.error("Analyze failed during recursive parse:", e);
          break;
        }
      }

      // Update states with processed data
      const finalQuestions = Array.isArray(rawQuestions) ? rawQuestions : [];
      setQuestions(finalQuestions);
      
      // Parse report if it's a string, otherwise use directly
      setMatchReport(deepParse(rawReport));
      
      console.log("Analysis Complete:", { report: rawReport, questions: finalQuestions });
      
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
        matchReport={matchReport} // Pass the report to ResultPanel
        loading={loading} 
      />
    </Box>
  );
}

export default App;