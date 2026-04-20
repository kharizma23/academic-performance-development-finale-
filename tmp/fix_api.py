import os

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Standardize localhost to 127.0.0.1 for IPV6 stability
    new_content = content.replace('localhost:8000', '127.0.0.1:8000')
    
    # 2. Dynamic host resolution for browser environments
    # Replace window.location.hostname with a conditional that forces IPv4 on localhost
    search_str = 'window.location.hostname'
    replacement_str = '(window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname)'
    
    # Avoid double replacement if already patched
    if replacement_str not in new_content:
        new_content = new_content.replace(search_str, replacement_str)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Surgical Fix Applied: {file_path}")

lib_dir = 'client/lib'
for filename in os.listdir(lib_dir):
    if filename.endswith('.ts'):
        fix_file(os.path.join(lib_dir, filename))
