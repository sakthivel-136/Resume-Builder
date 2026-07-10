with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for page0 or pageEl
matches = re.finditer(r'page0|page\d+|pages', html, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 150)
    end = min(len(html), m.end() + 250)
    print("--- MATCH ---\n", html[start:end], "\n")
