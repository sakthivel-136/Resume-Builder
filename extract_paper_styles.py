with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for .paper-page or #paperViewport in style section
style_content = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)[0]

matches = re.finditer(r'\.paper-page|paperViewport', style_content)
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(style_content), m.end() + 250)
    print("--- STYLE MATCH ---\n", style_content[start:end], "\n")
