import os
import requests
from dotenv import load_dotenv

#load env file
load_dotenv()

API_KEY = os.getenv("DEEPSEEK_API_KEY")
API_URL = "https://api.deepseek.com/v1/chat/completions"

if not API_KEY:
    raise ValueError("API not found")

def call_deepseek(prompt:str, model: str = "deepseek-chat", temperature: float = 0.7):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature
    }

    try:
        response = requests.post(API_URL, headers = headers, json = payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    test_prompt = "Give me three interview questions about python"
    result = call_deepseek(test_prompt)
    print(result)

        




