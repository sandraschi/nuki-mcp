import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Activity, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const [health, setHealth] = useState<{ status: string; service: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => { setHealth(d); setError(null); }).catch(e => setError(String(e)));
    fetch('/api/logs/stats').then(r => r.json()).then(d => setLogCount(d.total || 0)).catch(() => {});
  }, []);

  const connected = health?.status === 'ok';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Nuki Control Center</h1>
          <p className="text-slate-400">Real-time access management for Stroheckgasse v13.0</p>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-2xl border",
          connected ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {connected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          <span className="text-sm font-bold">{connected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Backend Status', value: connected ? 'Online' : 'Offline', sub: 'API health check', icon: Wifi, color: connected ? 'text-green-500' : 'text-red-500' },
          { label: 'Service', value: health?.service || 'nuki-mcp', sub: 'MCP server', icon: Shield, color: 'text-primary' },
          { label: 'Log Entries', value: String(logCount), sub: 'total recorded', icon: Activity, color: 'text-blue-500' },
          { label: 'Health', value: connected ? 'OK' : 'Error', sub: health?.status || error || 'unreachable', icon: Zap, color: connected ? 'text-green-500' : 'text-red-500' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={cn("p-3 rounded-2xl", `${color}/20`)}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
            </div>
            <div className="text-3xl font-black">{value}</div>
            <p className="text-xs text-slate-500 mt-1">{sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
