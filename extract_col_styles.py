with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re
style_content = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)[0]

# Search for sidebar or main styling in T2/T3
classes = ['.sidebar', '.main-col', '.left-col', '.right-col']
for c in classes:
    matches = re.finditer(re.escape(c) + r'\s*\{', style_content)
    for m in matches:
        start = m.start()
        end = style_content.find('}', start) + 1
        print(style_content[start:end])
