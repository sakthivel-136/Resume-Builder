with open('/Users/rekha/Downloads/resume_builder.html', 'r') as f:
    html = f.read()

import re

# Find all inputs
inputs = re.findall(r'<input[^>]*>', html)
selects = re.findall(r'<select[^>]*>.*?</select>', html, re.DOTALL)
buttons = re.findall(r'<button[^>]*>.*?</button>', html, re.DOTALL)

print(f"Total inputs: {len(inputs)}")
print(f"Total selects: {len(selects)}")
print(f"Total buttons: {len(buttons)}")

print("\n--- ALL RANGE INPUTS ---")
for i in inputs:
    if 'type="range"' in i or "type='range'" in i or 'range' in i:
        print("  ", i)

print("\n--- ALL COLOR INPUTS ---")
for i in inputs:
    if 'type="color"' in i or "type='color'" in i or 'color' in i:
        print("  ", i)

print("\n--- ALL SELECTS ---")
for s in selects:
    print("  ", s.split('\n')[0])

print("\n--- ALL OTHER INPUTS ---")
for i in inputs:
    if 'type="range"' not in i and 'type="color"' not in i:
        print("  ", i)
