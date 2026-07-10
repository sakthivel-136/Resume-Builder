import re

with open('original_prompt.txt', 'r') as f:
    text = f.read()

print("Length of text:", len(text))

# Search for color, font, spacing, customize, dim, bright, etc.
keywords = ['dim', 'bright', 'custom', 'spacing', 'line', 'color', 'picker', 'font', 'size', 'margin']
for kw in keywords:
    matches = [m.start() for m in re.finditer(kw, text, re.IGNORECASE)]
    print(f"Keyword '{kw}': {len(matches)} matches")

# Let's write a script to find all function definitions in the original script
script_matches = re.findall(r'<script>(.*?)</script>', text, re.DOTALL)
if script_matches:
    script_content = script_matches[0]
    print("\nOriginal Script Length:", len(script_content))
    funcs = re.findall(r'function\s+(\w+)\s*\(', script_content)
    print("Found functions:", funcs)
    
    # Search for occurrences of 'dim' or 'bright' or 'colors' or similar in script_content
    for kw in ['dim', 'bright', 'color', 'pal', 'font', 'spacing', 'margin', 'line']:
        matches = [m.start() for m in re.finditer(kw, script_content, re.IGNORECASE)]
        print(f"  Script Keyword '{kw}': {len(matches)} matches")
else:
    print("No script tags found!")
