import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PipelineVisualizer from './components/PipelineVisualizer';
import ClusterMonitor from './components/ClusterMonitor';
import NginxInspector from './components/NginxInspector';
import DockerfileViewer from './components/DockerfileViewer';
import CliVerification from './components/CliVerification';
import { Container, ShieldCheck, GitBranch, Server, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header Banner */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Docker Multi-Stage
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NGINX Web Server
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Kubernetes Rolling Updates
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              GitHub Actions CI/CD
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Containerized Web Application Deployment & Automated CI/CD
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
            Engineered production-grade containerization with multi-stage Docker builds, NGINX static web serving, automated linting & build verification pipelines on GitHub Actions, and zero-downtime Kubernetes deployments.
          </p>
        </div>

        {/* Tab Content Renderer */}
        <div className="transition-all duration-300">
          {activeTab === 'pipeline' && <PipelineVisualizer />}
          {activeTab === 'kubernetes' && <ClusterMonitor />}
          {activeTab === 'nginx' && <NginxInspector />}
          {activeTab === 'docker' && <DockerfileViewer />}
          {activeTab === 'cli' && <CliVerification />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d1117] py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Container className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-medium">Abhijit Uday Naik</span>
            <span className="text-slate-600">•</span>
            <span>Containerized Web App & Automated CI/CD (2025 – 2026)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Docker</span>
            <span>Kubernetes</span>
            <span>GitHub Actions</span>
            <span>NGINX</span>
            <span>React.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
