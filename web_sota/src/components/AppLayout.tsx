import React from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';
import { Bell, Search, User } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sidebarOpen } = useUIStore();

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />

            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                sidebarOpen ? "ml-64" : "ml-20"
            )}>
                <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tools or resources..."
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-800 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-800" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">Sandra Schipal</span>
                                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Admin</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
