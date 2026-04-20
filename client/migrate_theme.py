import os

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Surgical replacement nodes
    new_content = content.replace('olive-', 'blue-')
    new_content = new_content.replace('sage-', 'slate-')
    
    # Edge case: text-olive-600 might be text-blue-600
    # Also handle bg-olive-50 -> bg-blue-50
    # etc.
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

def migrate_theme(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                replace_in_file(os.path.join(root, file))

# Start migration
migrate_theme('app')
migrate_theme('components')
migrate_theme('lib')

print("Institutional Theme Migration (Olive -> Blue) Complete.")
