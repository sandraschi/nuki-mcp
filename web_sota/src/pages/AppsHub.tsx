import React from 'react';
import { Grid, Globe, Filter, ExternalLink } from 'lucide-react';

const apps = [
    { label: 'Filesystem', port: 13000, status: 'Active' },
    { label: 'Central Docs', port: 10795, status: 'Active' },
    { label: 'Database Ops', port: 10708, status: 'Paused' },
    { label: 'Speech', port: 10761, status: 'Active' },
];

export const AppsHub: React.FC = () => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Apps Hub</h1>
                    <p className="text-slate-400">Dynamic Fleet Discovery & Peer Federation.</p>
                </div>
                <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50">
                    <button className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        Local Fleet
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                        Remote Nodes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {apps.map((app) => (
                    <div key={app.label} className="glass-card group flex flex-col justify-between h-48">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-primary/20 transition-all duration-500">
                                    <Grid className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${app.status === 'Active' ? 'text-green-500 bg-green-500/10' : 'text-slate-500 bg-slate-800'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg">{app.label}</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">Port: {app.port}</p>
                        </div>

                        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-xs font-black uppercase tracking-widest transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Launch App
                        </button>
                    </div>
                ))}

                <div className="glass-card border-dashed bg-transparent flex flex-col items-center justify-center text-slate-600 hover:text-primary/50 hover:border-primary/30 cursor-pointer transition-all duration-500 h-48">
                    <div className="p-4 rounded-full border border-dashed mb-3">
                        <Filter className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Register New</span>
                </div>
            </div>
        </div>
    );
};
