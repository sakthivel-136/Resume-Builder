with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

print("HTML Length:", len(html))

# Let's search for "dim" or "bright" or "theme" or "toggle" or "color"
import re

for kw in ['dim', 'bright', 'color', 'pal', 'font', 'spacing', 'margin', 'line']:
    matches = [m.start() for m in re.finditer(kw, html, re.IGNORECASE)]
    print(f"Keyword '{kw}': {len(matches)} matches")

# Let's write a script to extract all script tags or look for functions related to those keywords
# Let's find matches and print around them
for m in re.finditer(r'dim', html, re.IGNORECASE):
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 100)
    print(f"--- MATCH 'dim' at {m.start()} ---\n", html[start:end], "\n")

for m in re.finditer(r'bright', html, re.IGNORECASE):
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 100)
    print(f"--- MATCH 'bright' at {m.start()} ---\n", html[start:end], "\n")
