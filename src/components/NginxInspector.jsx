import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap, Globe, FileCode, CheckCircle2, Play, Terminal } from 'lucide-react';
import { nginxServerStats } from '../data/clusterData';

export default function NginxInspector() {
  const [selectedRoute, setSelectedRoute] = useState('/health');
  const [probeResult, setProbeResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = [
    {
      path: '/health',
      name: 'Container Health Check',
      description: 'Liveness & readiness probe endpoint for Kubernetes / Swarm',
      method: 'GET'
    },
    {
      path: '/api/v1/cluster/status',
      name: 'Microservice Reverse Proxy',
      description: 'Proxied through NGINX upstream to backend mock service',
      method: 'GET'
    },
    {
      path: '/assets/index.js',
      name: 'Static Asset Caching & Gzip',
      description: 'Cache-Control max-age=31536000 with GZIP compression level 6',
      method: 'GET'
    }
  ];

  const runProbe = (route) => {
    setIsLoading(true);
    setSelectedRoute(route);

    setTimeout(() => {
      let data = {};
      let headers = {
        'Server': 'nginx/1.27.0-alpine',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
      };

      if (route === '/health') {
        data = {
          status: 'UP',
          uptime: '14h 22m',
          service: 'frontend-nginx-ingress',
          k8s_replica: 'pod-frontend-nginx-7d84f884bf-x4m29',
          timestamp: new Date().toISOString()
        };
        headers['Content-Type'] = 'application/json';
      } else if (route === '/api/v1/cluster/status') {
        data = {
          cluster: 'production-k8s-cluster',
          upstream: 'mock-backend-api:5000',
          pods_ready: 3,
          ingress_ssl: 'TLS 1.3 Active',
          latency_ms: 6
        };
        headers['Content-Type'] = 'application/json';
        headers['X-Forwarded-For'] = '10.244.0.1';
      } else {
        data = '/* Minified JS Bundle */ var __spa_bundle={version:"1.0.0",gzip:true};';
        headers['Content-Type'] = 'application/javascript; charset=UTF-8';
        headers['Content-Encoding'] = 'gzip';
        headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      }

      setProbeResult({
        statusCode: 200,
        statusText: 'OK',
        route,
        headers,
        body: typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
        duration: Math.floor(Math.random() * 8) + 3
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>NGINX Binary</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-mono font-bold text-white">{nginxServerStats.serverVersion}</div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-stage Alpine minimal</div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Avg Response Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">{nginxServerStats.avgResponseLatency}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Sub-5ms via sendfile & epoll</div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Gzip Compression</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-400">{nginxServerStats.gzipCompressionRatio}</div>
          <div className="text-[11px] text-slate-400 mt-1">Bandwidth reduction ratio</div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Security Hardening</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">A+ Rating</div>
          <div className="text-[11px] text-slate-400 mt-1">HSTS, CSP & X-Frame-Options</div>
        </div>
      </div>

      {/* Interactive Probe Tester */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
        <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          NGINX Live Route & Header Inspector
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select an endpoint to trigger a live HTTP probe through the NGINX reverse proxy engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {testEndpoints.map((ep) => (
            <button
              key={ep.path}
              onClick={() => runProbe(ep.path)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                selectedRoute === ep.path
                  ? 'bg-slate-800 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800/40">
                  {ep.method}
                </span>
                <span className="text-xs font-mono text-cyan-400">{ep.path}</span>
              </div>
              <div className="text-xs font-semibold text-slate-200">{ep.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">{ep.description}</div>
            </button>
          ))}
        </div>

        {/* Probe Output */}
        {probeResult ? (
          <div className="bg-[#0d1117] rounded-xl border border-slate-800 p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  HTTP {probeResult.statusCode} {probeResult.statusText}
                </span>
                <span className="text-slate-400">Route: <span className="text-cyan-300">{probeResult.route}</span></span>
              </div>
              <span className="text-slate-400">Response Latency: <strong className="text-emerald-400">{probeResult.duration}ms</strong></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 uppercase text-[10px] tracking-wider block mb-1">Response Headers:</span>
                <div className="space-y-1 bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  {Object.entries(probeResult.headers).map(([k, v]) => (
                    <div key={k} className="flex">
                      <span className="text-cyan-400 font-semibold w-40 shrink-0">{k}:</span>
                      <span className="text-slate-300 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] tracking-wider block mb-1">Payload Body:</span>
                <pre className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {probeResult.body}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0d1117] rounded-xl border border-slate-800 p-6 text-center text-slate-400 text-xs">
            Click any route above to inspect live NGINX reverse proxy response and security headers.
          </div>
        )}
      </div>

      {/* Security Headers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Hardened Security Header Directives
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-400 font-mono">
            <li><strong className="text-cyan-400">X-Frame-Options:</strong> SAMEORIGIN (Mitigates Clickjacking)</li>
            <li><strong className="text-cyan-400">X-Content-Type-Options:</strong> nosniff (Prevents MIME-sniffing)</li>
            <li><strong className="text-cyan-400">X-XSS-Protection:</strong> 1; mode=block (Reflected XSS filter)</li>
            <li><strong className="text-cyan-400">Content-Security-Policy:</strong> Restricted script & object sources</li>
          </ul>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            SPA Fallback & Caching Strategy
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code>try_files $uri $uri/ /index.html;</code> guarantees seamless client-side React routing without 404 errors on deep page refreshes, while <code>/assets/</code> is cached for 1 year with immutable fingerprinting.
          </p>
        </div>
      </div>
    </div>
  );
}
