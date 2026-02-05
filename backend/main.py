from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deepseek import call_deepseek
from resume_parser import extract_cv_text
import json
import re

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_questions")
async def generate_questions(
    cv: UploadFile = File(...),
    jd: str = Form(...),
    interviewer_info: str = Form("")
):
    # 1. Analyze CV to extract text content
    try:
        cv_text = await extract_cv_text(cv)
    except Exception as e:
        return JSONResponse(status_code=400, content={"detail": f"Resume parsing failed: {str(e)}"})

    # 2. Create a comprehensive prompt with Scoring Criteria and Workflow
    # Logic: Evaluation against Criteria -> Report Generation -> Question Design
    prompt = f"""
    # ROLE
    Act as an elite Technical Recruiter and Senior Interviewer.

    # CONTEXT
    - **Job Description (JD)**: {jd}
    - **Candidate Resume (CV)**: {cv_text}
    - **Interviewer Preferences**: {interviewer_info}

    # SCORING CRITERIA (Use this to calculate overall_score)
    - 90-100: Perfect match. Candidate possesses all "must-have" and most "preferred" skills.
    - 75-89: Strong match. Meets all core requirements but lacks some minor bonus qualifications.
    - 50-74: Fair match. Meets basic technical requirements but has significant experience gaps or missing secondary skills.
    - 0-49: Poor match. Fundamental skills or years of experience do not align with the role.

    # WORKFLOW
    1. **JD ANALYSIS**: Extract mandatory technical stacks, years of experience, and soft skill requirements.
    2. **CV COMPARISON**: Map the candidate's projects and skills directly against the JD. Identify "Strengths" (Exact matches) and "Gaps" (Missing/Weak areas).
    3. **QUANTITATIVE SCORING**: Assign an 'overall_score' based on the SCORING CRITERIA above.
    4. **CONTENT GENERATION**:
        - Generate a concise summary of the fit.
        - Create 10 professional, high-impact interview questions targeting the candidate's gaps and strengths.

    # CRITICAL INSTRUCTIONS
    1. **Language**: Always respond in the language used in the JD/CV.
    2. **Formatting**: Output ONLY a valid JSON object. No Markdown tags like ```json.
    3. **Conciseness**: Suggested answers must be within 150 words.
    4. **Realism**: The 'overall_score' must be a dynamic calculation based on JD/CV, not a placeholder.

    # OUTPUT STRUCTURE (Strict JSON)
    {{
      "match_report": {{
        "overall_score": [Calculate based on criteria],
        "strengths": ["string", "string"],
        "gaps": ["string", "string"],
        "summary": "Professional fit summary (2-3 sentences)."
      }},
      "questions": [
        {{
          "question": "Tailored question based on CV/JD...",
          "intent": "Why this specific question is asked...",
          "answer": "Professional reference answer..."
        }}
      ]
    }}
    """

    # 3. Call DeepSeek API
    deepseek_response = call_deepseek(prompt)

    # 4. Extract content from response
    if isinstance(deepseek_response, dict):
        try:
            content = deepseek_response["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            content = str(deepseek_response)
    else:
        content = str(deepseek_response)

    # 5. Robust parsing logic for nested structure
    # Standard cleanup for potential AI formatting issues
    clean_content = re.sub(r'^```[a-z]*\n|^```|```$', '', content.strip(), flags=re.MULTILINE).strip()

    try:
        # Primary attempt: Full JSON parsing
        data = json.loads(clean_content)
        match_report = data.get("match_report", {
            "overall_score": "N/A", 
            "strengths": [], 
            "gaps": [], 
            "summary": "Analysis generated but report structure was invalid."
        })
        questions_data = data.get("questions", [])
    except Exception as e:
        print(f"JSON Parse failed: {e}. Attempting Regex recovery for questions...")
        
        # Fallback report for UI stability
        match_report = {
            "overall_score": 0,
            "strengths": ["Error parsing strengths"],
            "gaps": ["Error parsing gaps"],
            "summary": "Formatting error: The AI's response couldn't be fully parsed into JSON."
        }
        
        # Regex recovery specifically for the questions array
        qa_pattern = r'\{\s*"question":\s*"(.*?)",\s*"intent":\s*"(.*?)",\s*"answer":\s*"(.*?)"\s*\}'
        matches = re.findall(qa_pattern, clean_content, re.DOTALL)
        
        if matches:
            questions_data = [
                {
                    "question": m[0].replace('\\"', '"').strip(), 
                    "intent": m[1].replace('\\"', '"').strip(), 
                    "answer": m[2].replace('\\"', '"').strip()
                } for m in matches
            ]
        else:
            questions_data = []

    # 6. Final response construction
    return JSONResponse(content={
        "match_report": match_report,
        "questions": questions_data
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)