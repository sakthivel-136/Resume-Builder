with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for page-break or 1123
for kw in ['1123', 'break', 'marker', 'height']:
    matches = [m.start() for m in re.finditer(kw, html, re.IGNORECASE)]
    print(f"Keyword '{kw}': {len(matches)} matches")

matches = re.finditer(r'break|marker', html, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 150)
    end = min(len(html), m.end() + 250)
    print("--- MATCH ---\n", html[start:end], "\n")
