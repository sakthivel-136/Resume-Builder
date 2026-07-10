with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re
style_content = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)[0]

# Search for paper-page class in style_content
matches = re.finditer(r'\.paper-page\s*\{', style_content)
for m in matches:
    start = m.start()
    end = style_content.find('}', start) + 1
    print(style_content[start:end])
