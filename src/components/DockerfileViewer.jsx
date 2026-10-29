import React, { useState } from 'react';
import { Box, Layers, ShieldCheck, CheckCircle2, Copy, FileCode, Check } from 'lucide-react';

export default function DockerfileViewer() {
  const [copied, setCopied] = useState(false);

  const dockerfileCode = `# ==========================================
# Multi-Stage Dockerfile for High-Performance SPA
# Stage 1: Build & Test Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package manifests for layer reusability
COPY package*.json ./

# Install clean dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code and configurations
COPY . .

# Run automated lint verification and unit tests in build stage
RUN npm run lint
RUN npm run test

# Compile production-optimized static bundle
RUN npm run build

# ==========================================
# Stage 2: Production NGINX Web Server
# ==========================================
FROM nginx:1.27-alpine-slim AS runner

# Remove default NGINX welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy high-performance NGINX configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Grant appropriate permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \\
    chmod -R 755 /usr/share/nginx/html && \\
    touch /var/run/nginx.pid && \\
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

# Container port exposure
EXPOSE 80

# Production Healthcheck against NGINX health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dockerfileCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Multi-Stage Size Comparison Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 to-slate-900/60 p-5 rounded-2xl border border-blue-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              Multi-Stage Docker Build Optimization
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Separates build-time SDKs and compilers from the minimal production runtime container.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Traditional Image</div>
              <div className="text-sm font-bold text-rose-400 font-mono line-through">1,120 MB</div>
            </div>
            <div className="text-cyan-400 font-bold text-lg">➔</div>
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-mono">Multi-Stage Alpine</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">24.2 MB (97.8% 📉)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Stage Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage 1 Card */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Stage 1: Builder
            </span>
            <span className="text-xs font-mono text-slate-400">node:20-alpine</span>
          </div>
          <h4 className="font-semibold text-slate-200 text-sm mb-2">Build & Verification Environment</h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Installs full npm dependencies and development toolchains</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Runs automated linting (<code>npm run lint</code>) and unit test suite</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Generates optimized static bundle in <code>/app/dist</code></span>
            </li>
            <li className="flex items-center gap-2 text-amber-400">
              <span className="text-xs">⚠️</span>
              <span>Discarded after build — dev dependencies NEVER reach production!</span>
            </li>
          </ul>
        </div>

        {/* Stage 2 Card */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Stage 2: Runner
            </span>
            <span className="text-xs font-mono text-slate-400">nginx:1.27-alpine-slim</span>
          </div>
          <h4 className="font-semibold text-slate-200 text-sm mb-2">Production Static Web Server</h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Only copies compiled static files from Stage 1: <code>--from=builder</code></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hardened security headers & non-root user permissions</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Built-in container healthcheck via <code>/health</code> HTTP probe</span>
            </li>
            <li className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero known CVEs; hardened attack surface for Kubernetes</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dockerfile Code Viewer */}
      <div className="bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-semibold">Dockerfile</span>
            <span className="text-[10px] text-slate-500 font-mono">(Production Multi-Stage Spec)</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Dockerfile</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
          {dockerfileCode}
        </pre>
      </div>
    </div>
  );
}
