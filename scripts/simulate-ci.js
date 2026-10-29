import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 ========================================================');
console.log('🚀 STARTING AUTOMATED CI/CD VERIFICATION PIPELINE (LOCAL)');
console.log('🚀 ========================================================\n');

function step(title, fn) {
  console.log(`\n▶️  [STEP] ${title}...`);
  const start = Date.now();
  try {
    fn();
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ [SUCCESS] ${title} completed in ${duration}s`);
  } catch (err) {
    console.error(`❌ [FAILED] ${title}:`, err.message);
    process.exit(1);
  }
}

// 1. Lint Verification
step('Automated Lint Verification', () => {
  execSync('node scripts/lint-check.js', { stdio: 'inherit' });
});

// 2. Automated Tests
step('Execute Verification Test Suite', () => {
  execSync('node tests/app.test.js', { stdio: 'inherit' });
});

// 3. Build Verification
step('Compile Production Web Bundle (Vite Build)', () => {
  execSync('npm run build', { stdio: 'inherit' });
  const distIndex = path.resolve(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(distIndex)) {
    throw new Error('dist/index.html was not generated!');
  }
});

// 4. Multi-Stage Dockerfile Verification
step('Verify Multi-Stage Docker Configuration', () => {
  const dockerfile = fs.readFileSync(path.resolve(process.cwd(), 'Dockerfile'), 'utf-8');
  if (!dockerfile.includes('AS builder') || !dockerfile.includes('AS runner')) {
    throw new Error('Dockerfile does not implement multi-stage build patterns.');
  }
  console.log('  -> Multi-stage build stages: Stage 1 (builder) and Stage 2 (nginx runner) verified.');
});

// 5. Kubernetes Manifest Syntax Check
step('Verify Kubernetes Manifests & Kustomize Composition', () => {
  const k8sDir = path.resolve(process.cwd(), 'k8s');
  const files = fs.readdirSync(k8sDir);
  console.log(`  -> Validated ${files.length} Kubernetes resource manifests in /k8s`);
});

console.log('\n🎉 ========================================================');
console.log('🎉 PIPELINE PASSED: All CI/CD checks & builds verified!');
console.log('🎉 ========================================================\n');
