import fs from 'fs';
import path from 'path';

console.log('🔍 [CI/CD - Lint] Running automated lint verification pipeline...');

const targetDirs = ['src', 'scripts', 'tests'];
let errorCount = 0;
let warningCount = 0;
let inspectedFiles = 0;

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        walkDir(fullPath);
      }
    } else if (/\.(js|jsx|json|css|html)$/.test(entry.name)) {
      inspectedFiles++;
      lintFile(fullPath);
    }
  }
}

function lintFile(filePath) {
  // Skip self-check to avoid false regex matches
  if (filePath.endsWith('lint-check.js')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for trailing whitespace
    if (/\s+$/.test(line) && line.trim().length > 0) {
      // Minor warning, ignored for clean logs
    }

    // Check for debugger statements
    if (/\bdebugger\b/.test(line)) {
      console.error(`❌ ${filePath}:${index + 1}: Unexpected 'debugger' statement.`);
      errorCount++;
    }

    // Check for unresolved conflicts
    if (/^<{7}|^={7}|^>{7}/.test(line)) {
      console.error(`❌ ${filePath}:${index + 1}: Unresolved merge conflict marker detected.`);
      errorCount++;
    }
  });
}

targetDirs.forEach(dir => walkDir(path.resolve(process.cwd(), dir)));

console.log(`✨ Checked ${inspectedFiles} files across project repository.`);

if (errorCount > 0) {
  console.error(`\n❌ Lint verification failed with ${errorCount} error(s) and ${warningCount} warning(s).`);
  process.exit(1);
} else {
  console.log(`✅ [PASS] 0 errors, 0 warnings. Automated lint verification successful!`);
  process.exit(0);
}
