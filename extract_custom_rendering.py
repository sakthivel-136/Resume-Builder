with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for TYPE_LABELS
matches = re.finditer(r'TYPE_LABELS', html)
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 200)
    print("--- TYPE_LABELS ---\n", html[start:end], "\n")

# Let's search for how custom section content is rendered
# Typically it would loop over customSections keys
matches2 = re.finditer(r'customSections', html)
for m in matches2:
    start = max(0, m.start() - 150)
    end = min(len(html), m.end() + 250)
    print("--- customSections render ---\n", html[start:end], "\n")
