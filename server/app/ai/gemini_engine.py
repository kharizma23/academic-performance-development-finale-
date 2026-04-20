import httpx
from typing import Optional
from app.config import settings

class GeminiEngine:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.gemini_api_key
        if self.api_key:
            print("Gemini REST Neural Engine Initialized.")
        else:
            print("Gemini API Key Missing.")

    async def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        if not self.api_key:
             return "AI REST Node Offline. Key missing."
             
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [{"parts": [{"text": f"Instruction: Respond concisely as a high-performance academic AI assistant. Query: {prompt}"}]}],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 800,
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    if 'candidates' in data and data['candidates']:
                        return data['candidates'][0]['content']['parts'][0]['text']
                    return "Neural Error: No response generated."
                else:
                    return f"Neural Error {res.status_code}: {res.text}"
        except Exception as e:
            return f"Neural Bridge Timeout/Error: {str(e)}"

# Global instance
gemini_engine = GeminiEngine()
