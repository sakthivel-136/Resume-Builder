with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Let's search for function mkCustomSection(id)
matches = re.finditer(r'function mkCustomSection\(', html)
for m in matches:
    start = m.start()
    # Find closing brace of function (rough approximation: search for the next 3000 chars)
    end = start + 3000
    print("--- mkCustomSection ---\n", html[start:end], "\n")
