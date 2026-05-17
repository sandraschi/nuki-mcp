import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AppsHub } from './pages/AppsHub';
import { ToolsHub } from './pages/ToolsHub';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/apps" element={<AppsHub />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/chat" element={<div className="p-8 text-center text-slate-500">LLM Chat Interface - Coming Soon</div>} />
          <Route path="/status" element={<div className="p-8 text-center text-slate-500">System Status Logs - Coming Soon</div>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
