export const initialPipelineStages = [
  {
    id: 'lint-and-verify',
    name: 'Lint & Build Verification',
    icon: 'CheckCircle2',
    status: 'success', // 'idle' | 'running' | 'success' | 'failed'
    duration: '14s',
    substeps: [
      { name: 'actions/checkout@v4', status: 'success', time: '1.2s' },
      { name: 'setup-node (v20.x)', status: 'success', time: '2.1s' },
      { name: 'npm ci (clean install)', status: 'success', time: '4.8s' },
      { name: 'npm run lint (0 warnings)', status: 'success', time: '1.8s' },
      { name: 'npm test (app.test.js)', status: 'success', time: '1.5s' },
      { name: 'npm run build (Vite SPA)', status: 'success', time: '2.6s' }
    ],
    logs: [
      '🔍 [CI/CD - Lint] Running automated lint verification pipeline...',
      '✨ Checked 24 files across project repository.',
      '✅ [PASS] 0 errors, 0 warnings. Automated lint verification successful!',
      '🧪 [CI/CD - Tests] Running Automated Verification Test Suite...',
      '  ✓ PASS: Dockerfile exists at root',
      '  ✓ PASS: Has Stage 1 (builder) with node base image',
      '  ✓ PASS: Has Stage 2 (runner) with nginx base image',
      '  ✓ PASS: Gzip compression is enabled in nginx.conf',
      '  ✓ PASS: All 8 Kubernetes manifests valid',
      '⚡ [Vite] Building for production...',
      '✓ built in 420ms -> dist/index.html (3.4 kB), dist/assets/index.js (148 kB)'
    ]
  },
  {
    id: 'docker-build',
    name: 'Multi-Stage Docker Build',
    icon: 'Box',
    status: 'success',
    duration: '28s',
    substeps: [
      { name: 'docker/setup-buildx-action', status: 'success', time: '1.4s' },
      { name: 'Stage 1: node:20-alpine (builder)', status: 'success', time: '12.3s' },
      { name: 'Stage 2: nginx:1.27-alpine-slim', status: 'success', time: '4.2s' },
      { name: 'Copy /app/dist -> /usr/share/nginx/html', status: 'success', time: '0.8s' },
      { name: 'Trivy Container Security Vulnerability Scan', status: 'success', time: '6.1s' },
      { name: 'Push to ghcr.io/containerized-web-app:v1.0.0', status: 'success', time: '3.2s' }
    ],
    logs: [
      '#1 [internal] load build definition from Dockerfile',
      '#2 [stage-1 1/7] FROM docker.io/library/node:20-alpine AS builder',
      '#3 [stage-1 4/7] RUN npm ci --prefer-offline',
      '#4 [stage-1 6/7] RUN npm run lint && npm test',
      '#5 [stage-1 7/7] RUN npm run build',
      '#6 [stage-2 1/5] FROM docker.io/library/nginx:1.27-alpine-slim AS runner',
      '#7 [stage-2 3/5] COPY nginx/nginx.conf /etc/nginx/nginx.conf',
      '#8 [stage-2 4/5] COPY --from=builder /app/dist /usr/share/nginx/html',
      '🛡️  Running Aquasec Trivy scanner...',
      'Total: 0 vulnerabilities (CRITICAL: 0, HIGH: 0, MEDIUM: 0)',
      '📦 Image size compressed: 24.2MB (vs single-stage 1.12GB). 97.8% footprint reduction!'
    ]
  },
  {
    id: 'k8s-deploy',
    name: 'Kubernetes Rolling Deploy',
    icon: 'Layers',
    status: 'success',
    duration: '18s',
    substeps: [
      { name: 'kustomize build k8s/ (dry-run)', status: 'success', time: '1.1s' },
      { name: 'kubectl apply -k k8s/ (web-production)', status: 'success', time: '2.4s' },
      { name: 'Rolling update: maxSurge=1, maxUnavailable=0', status: 'success', time: '9.5s' },
      { name: 'Readiness & Liveness probes pass (/health)', status: 'success', time: '3.2s' },
      { name: 'Ingress routing verified (app.cloudnative-hub.com)', status: 'success', time: '1.8s' }
    ],
    logs: [
      'namespace/web-production unchanged',
      'configmap/web-app-config configured',
      'secret/web-app-secrets configured',
      'service/frontend-nginx-service configured',
      'ingress.networking.k8s.io/frontend-nginx-ingress configured',
      'horizontalpodautoscaler.autoscaling/frontend-nginx-hpa configured',
      'deployment.apps/frontend-nginx-deployment image updated to ghcr.io/...:v1.0.0',
      'Waiting for deployment "frontend-nginx-deployment" rollout to finish: 1 of 3 updated replicas are available...',
      'Waiting for deployment "frontend-nginx-deployment" rollout to finish: 2 of 3 updated replicas are available...',
      'deployment "frontend-nginx-deployment" successfully rolled out with 0 downtime.'
    ]
  }
];
