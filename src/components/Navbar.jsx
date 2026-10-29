import React from 'react';
import { Container, Activity, ShieldCheck, Terminal, GitBranch, Server } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'pipeline', label: 'CI/CD Pipeline', icon: GitBranch },
    { id: 'kubernetes', label: 'Kubernetes Cluster', icon: Server },
    { id: 'nginx', label: 'NGINX Web Server', icon: Activity },
    { id: 'docker', label: 'Multi-Stage Docker', icon: Container },
    { id: 'cli', label: 'Verification Terminal', icon: Terminal },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0f1422]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Container className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">CloudNative Ops</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Production v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Docker Multi-Stage • Kubernetes • GitHub Actions • NGINX
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-mono">Cluster: Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
