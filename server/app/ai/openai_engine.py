import httpx
from typing import Optional
from app.config import settings

class OpenAIEngine:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.openai_api_key
        if self.api_key:
            print("OpenAI Neural Engine Initialized.")
        else:
            print("OpenAI API Key Missing.")

    async def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        if not self.api_key:
             return "AI REST Node Offline. OpenAI Key missing."
             
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a friendly and high-performance academic assistant. You must answer ANY question asked, no matter what it is. Always reply helpfully and accurately."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 800
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    if 'choices' in data and data['choices']:
                        return data['choices'][0]['message']['content']
                    return "Neural Error: No response generated from OpenAI."
                else:
                    raise Exception(f"Neural API Error {res.status_code}. Key invalid or depleted.")
        except Exception as e:
            raise e

# Global instance
openai_engine = OpenAIEngine()
