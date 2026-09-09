import fs from 'fs';
import path from 'path';

const seedPath = path.join(process.cwd(), 'database', 'seedData.js');
let content = fs.readFileSync(seedPath, 'utf8');

content = content.replace(/docAvatar: \{ public_id: "placeholder", url: ".*?" \}/g, (match, offset, string) => {
    // Find the closest "gender" before this match to determine male/female
    const genderMatch = string.substring(0, offset).match(/gender:\s*"(Male|Female)"/g);
    const lastGender = genderMatch ? genderMatch[genderMatch.length - 1] : "Male";
    
    if (lastGender.includes("Female")) {
        return `docAvatar: { public_id: "placeholder", url: "/doc-female.png" }`;
    } else {
        return `docAvatar: { public_id: "placeholder", url: "/doc-male.png" }`;
    }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log("Updated seedData.js image URLs.");
