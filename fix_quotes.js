const fs = require('fs');

// Read the file
const content = fs.readFileSync('prisma/asset-data.ts', 'utf-8');

// Function to escape quotes within remark strings
function fixRemarkQuotes(match, prefix, content, suffix) {
    // Escape any unescaped quotes in the content
    // Replace any quote that's not already escaped
    const fixedContent = content.replace(/(?<!\\)"/g, '\\"');
    
    return `${prefix}${fixedContent}${suffix}`;
}

// Pattern to match remark lines with potential quote issues
// This matches: remark: "content",
const pattern = /(remark: ")([^"]*(?:\\.[^"]*)*)"(,?\s*)/g;

// Apply the fix
const fixedContent = content.replace(pattern, fixRemarkQuotes);

// Write back to file
fs.writeFileSync('prisma/asset-data.ts', fixedContent, 'utf-8');

console.log("Fixed quote escaping in asset-data.ts"); 