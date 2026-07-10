import json

log_path = '/Users/rekha/.gemini/antigravity/brain/5ac15029-3f9b-4bab-8bfc-7d29d7186315/.system_generated/logs/transcript.jsonl'
with open(log_path, 'r') as f:
    line = f.readline()
    step = json.loads(line)
    content = step['content']
    # The content contains "<USER_REQUEST>\nbro this is my project currtenly doing <!DOCTYPE html>\n..."
    # Let's write the content to a file to examine it.
    with open('original_prompt.txt', 'w') as out:
        out.write(content)
print("Extracted successfully!")
