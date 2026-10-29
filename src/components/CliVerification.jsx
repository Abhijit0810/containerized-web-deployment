import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, Copy, Check, FileCheck, Layers } from 'lucide-react';

export default function CliVerification() {
  const [activeCommand, setActiveCommand] = useState('npm run ci:verify');
  const [copiedCmd, setCopiedCmd] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    '💡 Tip: Select a command below or execute directly in your local terminal to verify the project.',
    'Ready for verification execution...'
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const commandCatalog = [
    {
      id: 'ci',
      command: 'npm run ci:verify',
      label: 'Automated CI/CD Verification',
      description: 'Executes lint verification, tests, Vite production build & K8s manifest checks.'
    },
    {
      id: 'nginx',
      command: 'npm run serve:nginx',
      label: 'Run NGINX Production Server',
      description: 'Launches simulated NGINX server on port 8080 with exact security headers & health endpoint.'
    },
    {
      id: 'docker',
      command: 'docker build -t abhijitnaik/containerized-web-app:1.0.0 .',
      label: 'Build Multi-Stage Docker Image',
      description: 'Executes 2-stage build: node:20-alpine builder -> nginx:alpine-slim runner.'
    },
    {
      id: 'compose',
      command: 'docker compose up -d',
      label: 'Docker Compose Stack',
      description: 'Orchestrates frontend NGINX web app and mock backend microservice on bridge network.'
    },
    {
      id: 'k8s',
      command: 'kubectl apply -k k8s/ --dry-run=client',
      label: 'Kubernetes Dry-Run Audit',
      description: 'Validates complete Kustomize manifest bundle (Deployment, Service, Ingress, HPA).'
    }
  ];

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const simulateRun = (cmd) => {
    setIsExecuting(true);
    setActiveCommand(cmd);

    setTerminalOutput([
      `$ ${cmd}`,
      '⚡ Initializing runner process...'
    ]);

    setTimeout(() => {
      if (cmd.includes('ci:verify')) {
        setTerminalOutput([
          `$ ${cmd}`,
          '🚀 ========================================================',
          '🚀 STARTING AUTOMATED CI/CD VERIFICATION PIPELINE (LOCAL)',
          '🚀 ========================================================',
          '',
          '▶️  [STEP] Automated Lint Verification...',
          '🔍 [CI/CD - Lint] Running automated lint verification pipeline...',
          '✨ Checked 24 files across project repository.',
          '✅ [PASS] 0 errors, 0 warnings. Automated lint verification successful!',
          '✅ [SUCCESS] Automated Lint Verification completed in 0.42s',
          '',
          '▶️  [STEP] Execute Verification Test Suite...',
          '🧪 [CI/CD - Tests] Running Automated Verification Test Suite...',
          '  ✓ PASS: Dockerfile exists at root',
          '  ✓ PASS: Has Stage 1 (builder) with node base image',
          '  ✓ PASS: Installs dependencies with npm ci',
          '  ✓ PASS: Has Stage 2 (runner) with nginx base image',
          '  ✓ PASS: Copies compiled build assets from builder stage',
          '  ✓ PASS: Configures container healthcheck',
          '  ✓ PASS: Exposes web server port 80',
          '  ✓ PASS: nginx.conf exists & security-headers.conf exists',
          '  ✓ PASS: Gzip compression is enabled',
          '  ✓ PASS: Configures health probe route (/health)',
          '  ✓ PASS: Configures SPA routing fallback (try_files)',
          '  ✓ PASS: All 8 Kubernetes manifests valid (deployment, service, ingress, hpa, kustomization)',
          '  ✓ PASS: Configures RollingUpdate strategy with zero downtime',
          '✅ [SUCCESS] Execute Verification Test Suite completed in 0.31s',
          '',
          '▶️  [STEP] Compile Production Web Bundle (Vite Build)...',
          '✓ built in 580ms -> dist/index.html (3.4 kB), dist/assets/index.js (148 kB)',
          '✅ [SUCCESS] Compile Production Web Bundle completed in 0.58s',
          '',
          '▶️  [STEP] Verify Multi-Stage Docker Configuration...',
          '  -> Multi-stage build stages: Stage 1 (builder) and Stage 2 (nginx runner) verified.',
          '✅ [SUCCESS] Verify Multi-Stage Docker Configuration completed in 0.05s',
          '',
          '▶️  [STEP] Verify Kubernetes Manifests & Kustomize Composition...',
          '  -> Validated 8 Kubernetes resource manifests in /k8s',
          '✅ [SUCCESS] Verify Kubernetes Manifests & Kustomize Composition completed in 0.04s',
          '',
          '🎉 ========================================================',
          '🎉 PIPELINE PASSED: All CI/CD checks & builds verified! (Exit Code: 0)',
          '🎉 ========================================================'
        ]);
      } else if (cmd.includes('serve:nginx')) {
        setTerminalOutput([
          `$ ${cmd}`,
          '=============================================================',
          '🌐 NGINX Production Web Server running at http://localhost:8080',
          '📌 Health Check Endpoint:     http://localhost:8080/health',
          '📌 Reverse Proxy API Route:    http://localhost:8080/api/v1/cluster/status',
          '📌 Hardened Security Headers:  Active (CSP, HSTS, X-Frame-Options)',
          '📌 GZIP Compression Engine:   Active',
          '=============================================================',
          '[NGINX-ACCESS] 127.0.0.1 - - [2026-10-29T11:30:00.000Z] "GET / HTTP/1.1" 200 4ms',
          '[NGINX-ACCESS] 127.0.0.1 - - [2026-10-29T11:30:01.000Z] "GET /health HTTP/1.1" 200 1ms'
        ]);
      } else {
        setTerminalOutput([
          `$ ${cmd}`,
          'Sending build context to Docker daemon... 2.4MB',
          'Step 1/14 : FROM node:20-alpine AS builder',
          'Step 2/14 : WORKDIR /app',
          'Step 3/14 : COPY package*.json ./',
          'Step 4/14 : RUN npm ci --prefer-offline',
          'Step 5/14 : RUN npm run lint && npm run test',
          'Step 6/14 : RUN npm run build',
          'Step 7/14 : FROM nginx:1.27-alpine-slim AS runner',
          'Step 8/14 : COPY --from=builder /app/dist /usr/share/nginx/html',
          'Successfully built image abhijitnaik/containerized-web-app:1.0.0 (Size: 24.2MB)'
        ]);
      }
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Catalog of Commands */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
        <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Project Build & Execution CLI Commands
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Click any command to test verification output or copy to execute in your local shell.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commandCatalog.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                activeCommand === item.command
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                  <button
                    onClick={() => handleCopy(item.command)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === item.command ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="bg-[#090d14] px-2.5 py-1.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-cyan-300 break-all mb-2">
                  {item.command}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{item.description}</p>
              </div>

              <button
                onClick={() => simulateRun(item.command)}
                disabled={isExecuting}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all"
              >
                <Play className="w-3 h-3 fill-cyan-400" />
                <span>Simulate Run</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-[#090d14] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">powershell / bash - Execution Log</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">{activeCommand}</span>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[380px] space-y-1">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.includes('PASS') || line.includes('SUCCESS') || line.includes('PASSED') ? (
                <span className="text-emerald-400 font-semibold">{line}</span>
              ) : line.startsWith('$') ? (
                <span className="text-yellow-400 font-bold">{line}</span>
              ) : line.startsWith('▶️') || line.startsWith('🚀') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.startsWith('🌐') || line.startsWith('📌') ? (
                <span className="text-emerald-300 font-medium">{line}</span>
              ) : (
                <span className="text-slate-400">{line}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
