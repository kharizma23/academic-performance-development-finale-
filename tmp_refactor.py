import re

file_path = r"c:\Users\kharizma\Downloads\testcom-main\testcom-main\client\app\admin\department\[deptId]\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    (r"text-6xl md:text-7xl", "text-3xl md:text-4xl"),
    (r"h-28 w-28", "h-14 w-14"),
    (r"rounded-\[2rem\]", "rounded-xl"),
    (r"rounded-\[3rem\]", "rounded-2xl"),
    (r"rounded-\[2\.5rem\]", "rounded-xl"),
    (r"border-8", "border-2"),
    (r"border-\[12px\]", "border-2"),
    (r"border-\[8px\]", "border-2"),
    (r"border-\[6px\]", "border-2"),
    (r"border-\[4px\]", "border"),
    (r"p-10", "p-6"),
    (r"p-8", "p-5"),
    (r"pt-32 lg:p-12 lg:pt-32", "pt-24 lg:p-8 lg:pt-24"),
    (r"text-\[8rem\]", "text-5xl"),
    (r"text-\[9\.5rem\]", "text-6xl"),
    (r"text-4xl font-black", "text-xl font-bold"),
    (r"text-4xl", "text-xl"),
    (r"text-5xl", "text-2xl"),
    (r"text-3xl font-black", "text-lg font-bold"),
    (r"text-3xl", "text-lg"),
    (r"text-7xl", "text-3xl"),
    (r"text-5xl", "text-2xl"),
    (r"h-48 w-48", "h-24 w-24"),
    (r"h-40 w-40", "h-16 w-16"),
    (r"h-16 w-16", "h-10 w-10"),
    (r"h-16 px-8", "h-10 px-4"),
    (r"h-14 w-14", "h-8 w-8"),
    (r"h-24 w-24", "h-12 w-12"),
    (r"h-20 w-20", "h-10 w-10"),
    (r"px-8 py-3", "px-4 py-2"),
    (r"font-black", "font-semibold"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored UI classes successfully.")
