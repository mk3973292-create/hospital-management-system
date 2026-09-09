import fs from 'fs';
import path from 'path';

const seedPath = path.join(process.cwd(), 'database', 'seedData.js');
let content = fs.readFileSync(seedPath, 'utf8');

let maleCounter = 11;
let femaleCounter = 11;

content = content.replace(/docAvatar: \{ public_id: "placeholder", url: ".*?" \}/g, (match, offset, string) => {
    // Find the closest "gender" before this match to determine male/female
    const genderMatch = string.substring(0, offset).match(/gender:\s*"(Male|Female)"/g);
    const lastGender = genderMatch ? genderMatch[genderMatch.length - 1] : "Male";
    
    if (lastGender.includes("Female")) {
        const url = `https://randomuser.me/api/portraits/women/${femaleCounter}.jpg`;
        femaleCounter += 11; // 11, 22, 33...
        return `docAvatar: { public_id: "placeholder", url: "${url}" }`;
    } else {
        const url = `https://randomuser.me/api/portraits/men/${maleCounter}.jpg`;
        maleCounter += 11; // 11, 22, 33...
        return `docAvatar: { public_id: "placeholder", url: "${url}" }`;
    }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log("Updated seedData.js image URLs with unique randomuser portraits.");
