import fs from 'fs';
import path from 'path';

console.log('🧪 [CI/CD - Tests] Running Automated Verification Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

function assert(description, condition, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${description} ${details}`);
    failedTests++;
  }
}

// Test Suite 1: Dockerfile Multi-Stage Verification
console.log('📦 Test Suite 1: Multi-Stage Dockerfile Audit');
const dockerfilePath = path.resolve(process.cwd(), 'Dockerfile');
assert('Dockerfile exists at root', fs.existsSync(dockerfilePath));
if (fs.existsSync(dockerfilePath)) {
  const content = fs.readFileSync(dockerfilePath, 'utf-8');
  assert('Has Stage 1 (builder) with node base image', /FROM\s+node:.*AS\s+builder/i.test(content));
  assert('Installs dependencies with npm ci', /npm\s+ci/i.test(content));
  assert('Executes automated linting inside builder', /npm\s+run\s+lint/i.test(content));
  assert('Executes unit tests inside builder', /npm\s+run\s+test/i.test(content));
  assert('Compiles production build', /npm\s+run\s+build/i.test(content));
  assert('Has Stage 2 (runner) with nginx base image', /FROM\s+nginx:.*AS\s+runner/i.test(content));
  assert('Copies compiled build assets from builder stage', /COPY\s+--from=builder\s+\/app\/dist\s+\/usr\/share\/nginx\/html/i.test(content));
  assert('Configures container healthcheck', /HEALTHCHECK/i.test(content));
  assert('Exposes web server port 80', /EXPOSE\s+80/i.test(content));
}

// Test Suite 2: NGINX Configuration Audit
console.log('\n🌐 Test Suite 2: NGINX Web Server Configuration');
const nginxConfPath = path.resolve(process.cwd(), 'nginx', 'nginx.conf');
const securityConfPath = path.resolve(process.cwd(), 'nginx', 'security-headers.conf');
assert('nginx.conf exists', fs.existsSync(nginxConfPath));
assert('security-headers.conf exists', fs.existsSync(securityConfPath));
if (fs.existsSync(nginxConfPath)) {
  const nginxContent = fs.readFileSync(nginxConfPath, 'utf-8');
  assert('Gzip compression is enabled', /gzip\s+on;/i.test(nginxContent));
  assert('Configures health probe route (/health)', /location\s*=\s*\/health/i.test(nginxContent));
  assert('Configures SPA routing fallback (try_files)', /try_files\s+\$uri\s+\$uri\/\s+\/index\.html;/i.test(nginxContent));
  assert('Configures static assets cache-busting', /location\s+~\*\s+\\\.\(\?:css\|js/i.test(nginxContent));
  assert('Configures upstream reverse proxy', /upstream\s+backend_service/i.test(nginxContent));
}
if (fs.existsSync(securityConfPath)) {
  const secContent = fs.readFileSync(securityConfPath, 'utf-8');
  assert('Includes X-Frame-Options header', /X-Frame-Options/i.test(secContent));
  assert('Includes Content-Security-Policy header', /Content-Security-Policy/i.test(secContent));
  assert('Includes X-Content-Type-Options nosniff', /X-Content-Type-Options/i.test(secContent));
}

// Test Suite 3: Kubernetes Production Manifests Audit
console.log('\n☸️  Test Suite 3: Kubernetes Production Manifests');
const k8sDir = path.resolve(process.cwd(), 'k8s');
const requiredK8sFiles = [
  'namespace.yaml',
  'configmap.yaml',
  'secret.yaml',
  'deployment.yaml',
  'service.yaml',
  'ingress.yaml',
  'hpa.yaml',
  'kustomization.yaml'
];
requiredK8sFiles.forEach(file => {
  const exists = fs.existsSync(path.join(k8sDir, file));
  assert(`Manifest k8s/${file} exists`, exists);
});

const deploymentPath = path.join(k8sDir, 'deployment.yaml');
if (fs.existsSync(deploymentPath)) {
  const deployContent = fs.readFileSync(deploymentPath, 'utf-8');
  assert('Configures RollingUpdate strategy', /RollingUpdate/i.test(deployContent));
  assert('Configures CPU and Memory resource limits', /resources:\s+requests:[\s\S]*limits:/i.test(deployContent));
  assert('Configures container Liveness Probe', /livenessProbe:/i.test(deployContent));
  assert('Configures container Readiness Probe', /readinessProbe:/i.test(deployContent));
  assert('Enforces Pod Anti-Affinity for High Availability', /podAntiAffinity:/i.test(deployContent));
}

// Test Suite 4: GitHub Actions Workflow Audit
console.log('\n⚙️  Test Suite 4: GitHub Actions CI/CD Pipeline');
const workflowPath = path.resolve(process.cwd(), '.github', 'workflows', 'ci-cd.yml');
assert('GitHub Actions workflow file exists', fs.existsSync(workflowPath));
if (fs.existsSync(workflowPath)) {
  const wfContent = fs.readFileSync(workflowPath, 'utf-8');
  assert('Pipeline triggers on push and pull_request', /on:\s+push:[\s\S]*pull_request:/i.test(wfContent));
  assert('Contains lint-and-verify job', /lint-and-verify:/i.test(wfContent));
  assert('Contains docker-build job with caching', /docker-build:/i.test(wfContent));
  assert('Contains Kubernetes deployment stage', /k8s-deploy:/i.test(wfContent));
}

console.log(`\n==========================================`);
console.log(`Summary: ${passedTests} Passed, ${failedTests} Failed.`);
if (failedTests > 0) {
  console.error('❌ Test suite failed!');
  process.exit(1);
} else {
  console.log('✅ All automated verification tests passed successfully!');
  process.exit(0);
}
