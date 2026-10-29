import React, { useState } from 'react';
import { Server, Activity, Cpu, HardDrive, RefreshCw, Plus, Minus, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { initialPods } from '../data/clusterData';

export default function ClusterMonitor() {
  const [pods, setPods] = useState(initialPods);
  const [isRollingUpdate, setIsRollingUpdate] = useState(false);
  const [rolloutMessage, setRolloutMessage] = useState('');

  // Handle scaling pod replicas
  const handleScale = (delta) => {
    if (delta > 0 && pods.length < 6) {
      const newPodIndex = pods.length + 1;
      const newPod = {
        id: `frontend-nginx-7d84f884bf-${Math.random().toString(36).substring(2, 7)}`,
        node: `node-pool-prod-us-east-1${String.fromCharCode(97 + (pods.length % 3))}`,
        status: 'Running',
        ready: '1/1',
        restarts: 0,
        age: '1m',
        cpu: `${Math.floor(Math.random() * 20) + 30}m`,
        memory: `${Math.floor(Math.random() * 20) + 75}Mi`,
        ip: `10.244.${pods.length + 1}.${Math.floor(Math.random() * 100) + 10}`,
        healthStatus: 'Passing (HTTP 200)'
      };
      setPods([...pods, newPod]);
    } else if (delta < 0 && pods.length > 1) {
      setPods(pods.slice(0, -1));
    }
  };

  // Simulate Zero-Downtime Rolling Update
  const triggerRollingUpdate = () => {
    if (isRollingUpdate) return;
    setIsRollingUpdate(true);
    setRolloutMessage('Initiating Kubernetes RollingUpdate (maxSurge=1, maxUnavailable=0)...');

    setTimeout(() => {
      setRolloutMessage('Spawning candidate pod v1.0.1... Running readinessProbe on /health:80');
    }, 1200);

    setTimeout(() => {
      setRolloutMessage('Candidate pod passed readiness probe! Traffic shifted seamlessly. Terminating old pod replica.');
    }, 2800);

    setTimeout(() => {
      setRolloutMessage('Deployment "frontend-nginx-deployment" successfully rolled out. 0 downtime achieved!');
      setIsRollingUpdate(false);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Cluster Overview Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Namespace</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">web-production</div>
          <p className="text-[11px] text-slate-500 mt-1">Cluster: k8s-us-east-1</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Pod Replicas</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{pods.length} / {pods.length}</span>
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleScale(-1)}
                disabled={pods.length <= 1}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                title="Scale In"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleScale(1)}
                disabled={pods.length >= 6}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                title="Scale Out"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">HPA Target: 70% CPU / 80% Mem</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Aggregate CPU Usage</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {pods.reduce((acc, p) => acc + parseInt(p.cpu), 0)}m
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">~18% of cluster allocation</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Aggregate RAM Usage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {pods.reduce((acc, p) => acc + parseInt(p.memory), 0)}Mi
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">~32% of 768Mi limit</p>
        </div>
      </div>

      {/* Deployment Controls & Rolling Update Simulation */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">Deployment: frontend-nginx-deployment</h3>
            <span className="text-[10px] font-mono bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
              Strategy: RollingUpdate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero downtime upgrades with <code>readinessProbe</code> HTTP checks on port 80.
          </p>
          {rolloutMessage && (
            <p className="text-xs font-mono text-emerald-400 mt-2 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {rolloutMessage}
            </p>
          )}
        </div>

        <button
          onClick={triggerRollingUpdate}
          disabled={isRollingUpdate}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
            isRollingUpdate
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-95'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRollingUpdate ? 'animate-spin' : ''}`} />
          <span>{isRollingUpdate ? 'Rolling Out Candidate...' : 'Simulate Rolling Upgrade (Zero Downtime)'}</span>
        </button>
      </div>

      {/* Kubernetes Pods Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Live Pod Replicas ({pods.length})
          </h4>
          <span className="text-xs text-slate-400 font-mono">Image: abhijitnaik/containerized-web-app:1.0.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Pod ID</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Ready</th>
                <th className="px-5 py-3">Restarts</th>
                <th className="px-5 py-3">CPU</th>
                <th className="px-5 py-3">Memory</th>
                <th className="px-5 py-3">Pod IP</th>
                <th className="px-5 py-3">Node</th>
                <th className="px-5 py-3">Liveness / Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              {pods.map((pod) => (
                <tr key={pod.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-cyan-300 font-medium">{pod.id}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">{pod.ready}</td>
                  <td className="px-5 py-3 text-slate-400">{pod.restarts}</td>
                  <td className="px-5 py-3">{pod.cpu}</td>
                  <td className="px-5 py-3">{pod.memory}</td>
                  <td className="px-5 py-3 text-slate-400">{pod.ip}</td>
                  <td className="px-5 py-3 text-slate-400">{pod.node}</td>
                  <td className="px-5 py-3 text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{pod.healthStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingress & Routing Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            Ingress Controller Routing
          </div>
          <div className="text-xs space-y-1.5 text-slate-400 font-mono">
            <div>Host: <span className="text-cyan-300">app.cloudnative-hub.com</span></div>
            <div>TLS Secret: <span className="text-emerald-400">frontend-tls-cert (Let's Encrypt)</span></div>
            <div>Path: <span className="text-slate-200">/ &rarr; frontend-nginx-service:80</span></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-purple-400" />
            High Availability Anti-Affinity Policy
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pod anti-affinity guarantees that each frontend NGINX replica is scheduled onto a distinct physical Kubernetes worker node across availability zones for zero-downtime resilience.
          </p>
        </div>
      </div>
    </div>
  );
}
