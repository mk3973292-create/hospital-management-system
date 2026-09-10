import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- Step 1: Building Frontend ---');
execSync('npm install --prefix frontend && npm run build --prefix frontend', { stdio: 'inherit', cwd: rootDir });

console.log('\n--- Step 2: Building Admin Dashboard ---');
execSync('npm install --prefix dashboard && npm run build --prefix dashboard', { stdio: 'inherit', cwd: rootDir });

console.log('\n--- Step 3: Assembling Unified Output Directory ---');
const distDir = path.join(rootDir, 'dist');
const frontendDist = path.join(rootDir, 'frontend', 'dist');
const dashboardDist = path.join(rootDir, 'dashboard', 'dist');
const adminDist = path.join(distDir, 'admin');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

fs.mkdirSync(distDir, { recursive: true });
fs.cpSync(frontendDist, distDir, { recursive: true });

fs.mkdirSync(adminDist, { recursive: true });
fs.cpSync(dashboardDist, adminDist, { recursive: true });

console.log('\n✓ Build successful! Frontend and Admin Dashboard assembled into /dist.');
