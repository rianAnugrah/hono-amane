import re

# Read the file
with open('prisma/asset-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to escape quotes within remark strings
def fix_remark_quotes(match):
    prefix = match.group(1)  # 'remark: "'
    content = match.group(2)  # the content between quotes
    suffix = match.group(3)  # '",\n' or similar
    
    # Escape any unescaped quotes in the content
    # Replace any quote that's not already escaped
    fixed_content = re.sub(r'(?<!\\)"', r'\\"', content)
    
    return f'{prefix}{fixed_content}{suffix}'

# Pattern to match remark lines with potential quote issues
# This matches: remark: "content",
pattern = r'(remark: ")([^"]*(?:\\.[^"]*)*)"(,?\s*)'

# Apply the fix
fixed_content = re.sub(pattern, fix_remark_quotes, content)

# Write back to file
with open('prisma/asset-data.ts', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Fixed quote escaping in asset-data.ts") 