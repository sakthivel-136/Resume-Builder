import re

with open('original_prompt.txt', 'r') as f:
    text = f.read()

# Let's find all occurrences of type="range" or type="color" or select tags
ranges = re.findall(r'<input[^>]*type=["\']range["\'][^>]*>', text)
colors = re.findall(r'<input[^>]*type=["\']color["\'][^>]*>', text)
selects = re.findall(r'<select[^>]*>.*?</select>', text, re.DOTALL)

print("Ranges:")
for r in ranges:
    print("  ", r)

print("Colors:")
for c in colors:
    print("  ", c)

print("Selects:")
for s in selects:
    # Print just the select tag opening
    print("  ", s.split('\n')[0])
