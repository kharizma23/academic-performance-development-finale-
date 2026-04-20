import google.generativeai as genai
import os

def check_models():
    key = ""
    if os.path.exists(".env"):
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
        print("Testing models for generation:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"Testing {m.name}...", end=" ")
                try:
                    model = genai.GenerativeModel(m.name)
                    # Try a tiny generation
                    resp = model.generate_content("hi", generation_config={"max_output_tokens": 5})
                    print(f"SUCCESS: {resp.text.strip()}")
                except Exception as e:
                    print(f"FAILED: {e}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    check_models()
