import { readFileSync, writeFileSync } from 'fs';

// Read the file
const content = readFileSync('prisma/asset-data.ts', 'utf-8');

// Fix the quote escaping issues
// Replace \\\" with \" (proper escaping)
// Replace \\\\" with \" (remove extra backslashes)
let fixedContent = content
  .replace(/\\\\\\\\\"/g, '\\"')  // Replace \\\\" with \"
  .replace(/\\\\\"/g, '\\"');     // Replace \\\" with \"

// Write back to file
writeFileSync('prisma/asset-data.ts', fixedContent, 'utf-8');

console.log("Fixed quote escaping in asset-data.ts"); 