import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    MessageSquare,
    Activity,
    Grid,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Grid, label: 'Apps Hub', path: '/apps' },
    { icon: Settings, label: 'Tools Hub', path: '/tools' },
    { icon: MessageSquare, label: 'LLM Chat', path: '/chat' },
    { icon: Activity, label: 'Status', path: '/status' },
];

export const Sidebar: React.FC = () => {
    const { sidebarOpen, toggleSidebar } = useUIStore();

    return (
        <aside
            className={cn(
                "glass-panel fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col",
                sidebarOpen ? "w-64" : "w-20"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-primary animate-pulse-slow" />
                    </div>
                    {sidebarOpen && (
                        <span className="font-bold text-lg tracking-tight">Nuki SOTA</span>
                    )}
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-slate-800 rounded-md transition-colors"
                >
                    {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-2 py-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                    >
                        <item.icon className="w-6 h-6 min-w-[24px]" />
                        {sidebarOpen && (
                            <span className="font-medium whitespace-nowrap opacity-100 transition-opacity duration-300">
                                {item.label}
                            </span>
                        )}
                        {!sidebarOpen && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <div className={cn(
                    "bg-slate-900/50 rounded-lg p-3 flex items-center gap-3",
                    !sidebarOpen && "justify-center"
                )}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {sidebarOpen && <span className="text-xs text-slate-400">Backend Connected</span>}
                </div>
            </div>
        </aside>
    );
};
