with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search the style content
style_content = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)[0]

print("Style Length:", len(style_content))

classes = ['kv-row', 'kv-label', 'skill-pill', 'tl-block', 'tl-row', 'tl-title', 'tl-date', 'tl-desc', 'p-ach']
for c in classes:
    matches = re.finditer(r'\.' + c, style_content)
    for m in matches:
        # Find closing brace of class
        start = m.start()
        end = style_content.find('}', start) + 1
        print(f"--- Class {c} ---\n", style_content[start:end], "\n")
