import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, Terminal, Shield, ArrowRight, RefreshCw, FileText, Sparkles, Layers } from 'lucide-react';
import { initialPipelineStages } from '../data/pipelineData';

export default function PipelineVisualizer() {
  const [stages, setStages] = useState(initialPipelineStages);
  const [activeStageId, setActiveStageId] = useState('lint-and-verify');
  const [isRunning, setIsRunning] = useState(false);
  const [activeRunNumber, setActiveRunNumber] = useState(42);
  const [streamedLogs, setStreamedLogs] = useState([]);

  const activeStage = stages.find((s) => s.id === activeStageId) || stages[0];

  useEffect(() => {
    setStreamedLogs(activeStage.logs);
  }, [activeStageId]);

  const triggerPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveRunNumber((prev) => prev + 1);

    // Reset all stages to idle
    setStages((prev) =>
      prev.map((stage) => ({ ...stage, status: 'idle', duration: '--' }))
    );
    setStreamedLogs(['🚀 [GitHub Actions] Workflow run queued on branch: main...']);

    // Stage 1: Lint & Verify
    setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => (s.id === 'lint-and-verify' ? { ...s, status: 'running' } : s))
      );
      setActiveStageId('lint-and-verify');
      setStreamedLogs([
        '🚀 [Phase 1] Starting Automated Linting & Build Verification...',
        '📦 Checking out repository branch refs/heads/main',
        '⚡ Setting up Node.js v20.18.0 with npm caching',
        '🔍 Running npm run lint...',
        '✨ 0 lint warnings detected across 24 files',
        '🧪 Running unit test suite (node tests/app.test.js)...',
        '  ✓ PASS: Dockerfile multi-stage integrity verified',
        '  ✓ PASS: NGINX security headers and SPA rules confirmed',
        '  ✓ PASS: Kubernetes deployment, service, ingress manifests valid',
        '🔨 Executing npm run build (Vite SPA production compilation)...',
        '✓ Production bundle generated in dist/ (gzip compressed: 42.1 kB)'
      ]);
    }, 600);

    // Complete Stage 1 & Start Stage 2 (Docker Build)
    setTimeout(() => {
      setStages((prev) =>
        prev.map((s) =>
          s.id === 'lint-and-verify'
            ? { ...s, status: 'success', duration: '12.4s' }
            : s.id === 'docker-build'
            ? { ...s, status: 'running' }
            : s
        )
      );
      setActiveStageId('docker-build');
      setStreamedLogs([
        '🐳 [Phase 2] Executing Multi-Stage Docker Build with Buildx...',
        '#1 [builder] FROM node:20-alpine AS builder',
        '#2 [builder] COPY package*.json ./ && npm ci --prefer-offline',
        '#3 [builder] COPY . . && npm run build',
        '#4 [runner] FROM nginx:1.27-alpine-slim AS runner',
        '#5 [runner] COPY nginx/nginx.conf /etc/nginx/nginx.conf',
        '#6 [runner] COPY --from=builder /app/dist /usr/share/nginx/html',
        '🛡️  Executing Aqua Security Trivy Container Scan...',
        '✓ No vulnerabilities detected! (0 Critical, 0 High)',
        '🚀 Image abhijitnaik/containerized-web-app:v1.0.0 tagged and ready (Size: 24.2 MB)'
      ]);
    }, 2800);

    // Complete Stage 2 & Start Stage 3 (K8s Deploy)
    setTimeout(() => {
      setStages((prev) =>
        prev.map((s) =>
          s.id === 'docker-build'
            ? { ...s, status: 'success', duration: '24.1s' }
            : s.id === 'k8s-deploy'
            ? { ...s, status: 'running' }
            : s
        )
      );
      setActiveStageId('k8s-deploy');
      setStreamedLogs([
        '☸️  [Phase 3] Kubernetes Rolling Update & Verification...',
        '🔍 Validating manifests with Kustomize client dry-run...',
        '🚀 Applying deployment: frontend-nginx-deployment to namespace web-production',
        '🔄 Rolling update initiated: maxSurge=1, maxUnavailable=0',
        '⏳ Pod frontend-nginx-new-replica-1 created -> ReadinessProbe /health: 200 OK',
        '⏳ Pod frontend-nginx-new-replica-2 created -> ReadinessProbe /health: 200 OK',
        '⏳ Terminating legacy pod replicas safely...',
        '✅ Deployment rollout completed with ZERO downtime!'
      ]);
    }, 5200);

    // All Complete
    setTimeout(() => {
      setStages((prev) =>
        prev.map((s) =>
          s.id === 'k8s-deploy' ? { ...s, status: 'success', duration: '16.8s' } : s
        )
      );
      setIsRunning(false);
    }, 7200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
              Run #{activeRunNumber}
            </span>
            <h2 className="text-lg font-bold text-white">Automated CI/CD Pipeline Verification</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Triggered via <code className="text-cyan-300">push (refs/heads/main)</code> • Multi-stage Docker & Kubernetes rolling release
          </p>
        </div>

        <button
          onClick={triggerPipeline}
          disabled={isRunning}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-lg ${
            isRunning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/20 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Pipeline Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Trigger Automated Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Stage Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">Phase 0{idx + 1}</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    stage.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : stage.status === 'running'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stage.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {stage.status === 'running' && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
                  {stage.status === 'idle' && <Clock className="w-3 h-3" />}
                  <span className="capitalize">{stage.status}</span>
                </span>
              </div>

              <h3 className="font-semibold text-slate-100 text-sm">{stage.name}</h3>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Duration: <strong className="text-slate-200 font-mono">{stage.duration}</strong></span>
                <span className="text-cyan-400 flex items-center gap-1 hover:underline">
                  View Logs <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Substeps Breakdown & Live Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Substeps Column */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
          <h4 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Stage Breakdown: {activeStage.name}
          </h4>
          <div className="space-y-2.5">
            {activeStage.substeps.map((sub, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  <span className="font-mono text-slate-300">{sub.name}</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">{sub.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-blue-300">
            <p className="font-medium mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Automated Verification Guarantee:
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pull requests are strictly blocked from merge unless automated linting passes with 0 warnings, all unit tests pass, and container image passes Trivy security audits.
            </p>
          </div>
        </div>

        {/* Live Terminal Log Viewer */}
        <div className="lg:col-span-7 bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-96">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                actions/runner-ubuntu-latest.log
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
              STREAMING
            </span>
          </div>

          <div className="p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-1.5 flex-1">
            {streamedLogs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                {log.startsWith('✓') || log.startsWith('✅') ? (
                  <span className="text-emerald-400">{log}</span>
                ) : log.startsWith('🔍') || log.startsWith('⚡') || log.startsWith('🚀') ? (
                  <span className="text-cyan-400 font-semibold">{log}</span>
                ) : log.startsWith('🐳') || log.startsWith('☸️') ? (
                  <span className="text-blue-400 font-semibold">{log}</span>
                ) : log.startsWith('#') ? (
                  <span className="text-purple-300">{log}</span>
                ) : (
                  <span className="text-slate-400">{log}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
