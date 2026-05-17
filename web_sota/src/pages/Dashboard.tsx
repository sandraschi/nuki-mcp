import React, { useState } from 'react';
import { Lock, Unlock, Battery, Zap, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface LockCardProps {
  name: string;
  status: 'locked' | 'unlocked';
  type: string;
  battery: number;
}

const LockCard: React.FC<LockCardProps> = ({ name, status: initialStatus, type, battery }) => {
  const [status, setStatus] = useState(initialStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-500",
            status === 'locked' ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-500"
          )}>
            {status === 'locked' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-xs text-slate-500 font-medium tracking-wide">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
          <Battery className={cn("w-3.5 h-3.5", battery < 20 ? "text-red-500" : "text-green-500")} />
          <span className="text-[10px] font-bold">{battery}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm py-2 px-3 bg-slate-900/40 rounded-lg">
          <span className="text-slate-400">Status</span>
          <span className={cn(
            "font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-widest",
            status === 'locked' ? "text-primary border border-primary/30" : "text-green-500 border border-green-500/30"
          )}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setStatus(status === 'locked' ? 'unlocked' : 'locked')}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95",
              status === 'locked'
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            )}
          >
            {status === 'locked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {status === 'locked' ? 'Unlock' : 'Lock'}
          </button>

          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-all active:scale-95">
            <Zap className="w-4 h-4" />
            Buzz
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Nuki Control Center</h1>
          <p className="text-slate-400">Real-time access management for Stroheckgasse v13.0</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary opacity-50" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Security Mode</span>
              <span className="text-sm font-bold text-primary">REDUCED FRICTION</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LockCard name="Front Door" status="locked" type="Smart Lock Ultra" battery={82} />
        <LockCard name="Intercom" status="unlocked" type="Opener" battery={100} />
        <LockCard name="Studio" status="locked" type="Smart Lock Pro" battery={15} />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        <div className="glass-panel rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50">
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Time</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Device</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">Action</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 tracking-widest">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {[
                { time: '10:42 AM', device: 'Front Door', action: 'Unlocked', user: 'Sandra' },
                { time: '09:15 AM', device: 'Intercom', action: 'Buzzed', user: 'Package Delivery' },
                { time: '08:02 AM', device: 'Studio', action: 'Locked', user: 'System Auto' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">{log.time}</td>
                  <td className="px-6 py-4 text-sm font-bold">{log.device}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] uppercase font-black px-2 py-0.5 rounded border tracking-widest",
                      log.action === 'Unlocked' ? "text-green-500 border-green-500/20" : "text-primary border-primary/20"
                    )}>{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
