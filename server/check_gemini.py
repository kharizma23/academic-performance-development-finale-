import google.generativeai as genai
import os
from typing import Optional

def check_models():
    # Load from .env manually or via os (assuming it's set or in current folder)
    key = ""
    with open(".env", "r") as f:
        for line in f:
            if "GEMINI_API_KEY" in line:
                key = line.split("=")[1].strip()
    
    if not key:
        print("No Key Found.")
        return

    genai.configure(api_key=key)
    try:
        models = genai.list_models()
        print("Available Models:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    check_models()
