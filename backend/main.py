from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deepseek import call_deepseek
from resume_parser import extract_cv_text
import json

app = FastAPI()

# CORS 配置（必须在路由前面）
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
    cv_text = await extract_cv_text(cv)

    prompt = f"""
    Job Description:
    {jd}

    Candidate CV:
    {cv_text}

    Interviewer Info:
    {interviewer_info}

    You are an experienced software engineering interviewer.

    Your task:
    - Read the Job Description (JD) and Candidate CV below.
    - Generate exactly 10 interview questions based on the CV and JD.
    - Questions must be relevant to the JD and CV — do NOT include generic or unrelated questions.
    - Avoid irrelevant examples (e.g., capital of France, writing poems, jokes, etc.).
    - Output only the numbered list of questions, no extra text or explanations.
    """

    prompt = f"""
    # ROLE
    You are a highly experienced software engineering interviewer, known for asking insightful and precise questions.

    # CONTEXT
    - **Job Description (JD)**: 
    {jd}

    - **Candidate CV**: 
    {cv_text}

    - **Interviewer Info**: 
    {interviewer_info}

    # PRIMARY TASK
    Based on all the provided context, generate exactly 10 highly relevant software engineering interview questions.

    # CRITICAL INSTRUCTIONS (Must be followed precisely)
    1.  **Thinking Process**:
    a. First, identify the 3-5 most critical technical skills (e.g., 'Python', 'React', 'AWS', 'Microservices') required by the [JD].
    b. Second, locate the specific projects or experiences in the [CV] where the candidate claims to have used these skills.
    c. Third, formulate questions that directly probe the candidate's experience (from the CV) in relation to the job's needs (from the JD). For example, instead of a generic "Tell me about microservices," ask "In your project X, you used microservices. What was the biggest challenge you faced with inter-service communication, and how does that relate to the requirements of our role described in the JD?"

    2.  **Question Distribution (Strictly 10 questions total)**:
    - **5 Project Deep Dive Questions**: Ask about specific projects from the CV. Focus on "what, why, how".
    - **3 Technical Concept Questions**: Test their understanding of technologies mentioned in both the CV and JD.
    - **2 Behavioral Questions**: Frame these around experiences mentioned in the CV.

    3.  **Constraints**:
    - **NO** generic questions (e.g., "What are your strengths?"). Every question must be justifiable by linking a detail from the CV to a requirement in the JD.
    - The questions should reflect the seniority and specialization mentioned in the [Interviewer Info].

    4.  **OUTPUT FORMAT**:
    - Output **ONLY** a numbered list of 10 questions.
    - **DO NOT** include titles, categories, explanations, or any other text before or after the list.
    """

    # print("=== JD Received ===")
    # print(jd)
    # print("=== CV Text Received ===")
    # print(cv_text)

    deepseek_response = call_deepseek(prompt)

    # =======================================================
    # 新增或修改：打印 DeepSeek 返回的完整内容
    # =======================================================
    print("--- DeepSeek 原始响应 JSON ---")
    import json
    # 使用 json.dumps 格式化打印字典，方便查看
    print(json.dumps(deepseek_response, indent=4, ensure_ascii=False))
    print("------------------------------")

   # 假设 deepseek_response 是字典
    if isinstance(deepseek_response, dict):
        try:
            content = deepseek_response["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            content = str(deepseek_response)
    else:
        content = str(deepseek_response)

    # 按行拆成问题列表
    questions_list = [q.strip() for q in content.split("\n") if q.strip()]

    return JSONResponse(content={"questions": questions_list})