with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for dashed or marker or border-top
keywords = ['dashed', 'marker', 'border-top', 'page-break', 'pageBreak', 'A4H']
for kw in keywords:
    matches = [m.start() for m in re.finditer(kw, html, re.IGNORECASE)]
    print(f"Keyword '{kw}': {len(matches)} matches")

# Print matches
matches = re.finditer(r'dashed|A4H|Break', html)
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 200)
    print("--- MATCH ---\n", html[start:end], "\n")
