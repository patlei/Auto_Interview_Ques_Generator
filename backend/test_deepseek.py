import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DEEPSEEK_API_KEY")

API_URL = "https://api.deepseek.com/v1/chat/completions"

def test_deepseek():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role":"user",
            "content":"give me three interview questions about Python"}
        ],
        "temperature":0.7
    }
     
    response = requests.post(API_URL, headers = headers, json = payload)

    print("Status code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    test_deepseek()




