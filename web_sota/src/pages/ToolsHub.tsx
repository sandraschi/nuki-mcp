import React from 'react';
import { Terminal, Code, Info, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
    { name: 'get_lock_status', rationale: 'Check real-time state and battery of smart locks.', type: 'SOLO' },
    { name: 'set_lock_state', rationale: 'Explicitly control locking mechanism via Home Assistant.', type: 'SOLO' },
    { name: 'buzz_opener', rationale: 'Trigger electric strike for building intercom entry.', type: 'SOLO' },
    { name: 'smart_entry_sequence', rationale: 'Agentic workflow to buzz entrance and unlock apartment.', type: 'PORTMANTEAU' },
];

export const ToolsHub: React.FC = () => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Tools Hub</h1>
                <p className="text-slate-400">Dynamic MCP tool analysis and diagnostic execution layer.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {tools.map((tool, i) => (
                        <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-primary/20 transition-colors">
                                    <Terminal className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg">{tool.name}</h3>
                                        <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded border border-slate-700 text-slate-500 bg-slate-800/50 uppercase">
                                            {tool.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 max-w-md">{tool.rationale}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors" />
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            GrokTools Diagnostic
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] text-slate-500 block mb-1">Server Type</span>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                                    <Code className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-mono">FastMCP 3.1 (Python)</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 block mb-1">Capabilities</span>
                                <div className="flex flex-wrap gap-2">
                                    {['Tools', 'Prompts', 'Resources', 'Sampling'].map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-300 font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" />
                                Run Health Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
