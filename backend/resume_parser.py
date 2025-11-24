import pdfplumber
import docx

async def extract_cv_text(cv_file):
    """
    Parse the resume text based on the file type, supporting txt / pdf / docx
    cv_file: FastAPI UploadFile 对象
    """
    filename = cv_file.filename.lower()

    if filename.endswith(".pdf"):
        # parse PDF
        with pdfplumber.open(cv_file.file) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        return text

    elif filename.endswith(".docx"):
        # parse docx
        doc = docx.Document(cv_file.file)
        text = "\n".join(para.text for para in doc.paragraphs)
        return text

    else:
        # default parse txt
        return (await cv_file.read()).decode("utf-8", errors="ignore")
