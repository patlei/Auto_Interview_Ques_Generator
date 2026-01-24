from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deepseek import call_deepseek
from resume_parser import extract_cv_text
import json
import re

app = FastAPI()

# CORS 配置
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
    # 1. 解析简历文本
    try:
        cv_text = await extract_cv_text(cv)
    except Exception as e:
        return JSONResponse(status_code=400, content={"detail": f"Resume parsing failed: {str(e)}"})

    # 2. 构造自适应 Prompt
    # 核心修改：增加了长度约束和更严谨的 JSON 指令，防止截断
    prompt = f"""
    # ROLE IDENTIFICATION
    - Identify the professional field from JD and CV.
    - Act as a senior expert (10+ years exp) in that field.

    # CONTEXT
    - **JD**: {jd}
    - **CV**: {cv_text}
    - **Extra Info**: {interviewer_info}

    # PRIMARY TASK
    Generate exactly 10 high-quality interview questions and reference answers.

    # CRITICAL INSTRUCTIONS
    1. **Language**: Match the language of the JD/CV.
    2. **Length Control (IMPORTANT)**: Each "answer" must be concise and under 150 words. Do not be overly verbose to avoid response truncation.
    3. **JSON Reliability**: Output ONLY a valid JSON array. Do not include markdown tags like ```json.

    # OUTPUT FORMAT
    [
      {{"question": "Question text", "answer": "Concise reference answer"}},
      ...
    ]
    """

    # 3. 调用 DeepSeek API
    deepseek_response = call_deepseek(prompt)

    # 4. 提取 API 返回内容
    if isinstance(deepseek_response, dict):
        try:
            content = deepseek_response["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            content = str(deepseek_response)
    else:
        content = str(deepseek_response)

    # 5. 强力解析逻辑 (针对截断和格式错误优化)
    questions_data = []
    
    # 预清洗：去掉可能存在的 Markdown 标签
    clean_content = re.sub(r'^```[a-z]*\n|^```|```$', '', content.strip(), flags=re.MULTILINE).strip()

    try:
        # 尝试标准 JSON 解析
        questions_data = json.loads(clean_content)
    except Exception as e:
        print(f"Standard JSON Parse failed: {e}. Attempting Regex recovery...")
        
        # 【核心修复】：使用正则表达式从残缺的文本中提取已经生成的完整 QA 对
        # 这个正则会匹配 {"question": "...", "answer": "..."} 结构，即使 JSON 没写完也能抓取前面的
        qa_pattern = r'\{\s*"question":\s*"(.*?)",\s*"answer":\s*"(.*?)"\s*\}'
        matches = re.findall(qa_pattern, clean_content, re.DOTALL)
        
        if matches:
            questions_data = [{"question": m[0].strip(), "answer": m[1].strip()} for m in matches]
        else:
            # 最后的兜底：如果连正则都抓不到，再尝试按行切分纯文本
            lines = [l.strip() for l in clean_content.split('\n') if len(l.strip()) > 10 and '{' not in l]
            questions_data = [{"question": line, "answer": "内容生成过长被截断，建议缩短输入信息。"} for line in lines[:10]]

    # 6. 返回结果
    return JSONResponse(content={"questions": questions_data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)