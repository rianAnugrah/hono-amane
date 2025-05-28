const fs = require('fs');

let content = fs.readFileSync('prisma/asset-data.ts', 'utf8');

// Fix patterns like: remark: "text"more text",
// Replace with: remark: "text\"more text",
content = content.replace(/remark: "([^"]*)"([^"]*)",/g, 'remark: "$1\\"$2",');

fs.writeFileSync('prisma/asset-data.ts', content);
console.log('Fixed quotes in asset-data.ts'); 