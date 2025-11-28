import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import TaskManager from './components/TaskManager';
import AssetManager from './components/AssetManager';
import SmartPlanner from './components/SmartPlanner';
import AIAssistant from './components/AIAssistant';
import TimeSchedule from './components/TimeSchedule';
import { storageService } from './services/storage';
import { Ticket, Asset, DailyLogItem, Subscription, TaskStatus, Priority, LocationType } from './types';
import { CheckCircle2, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // centralized state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [logs, setLogs] = useState<DailyLogItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Load data on mount
  useEffect(() => {
    setTickets(storageService.getTickets());
    setAssets(storageService.getAssets());
    setLogs(storageService.getLogs());
    setSubscriptions(storageService.getSubscriptions());
  }, []);

  // Persist data on change
  useEffect(() => { if(tickets.length) storageService.saveTickets(tickets); }, [tickets]);
  useEffect(() => { if(assets.length) storageService.saveAssets(assets); }, [assets]);
  useEffect(() => { if(logs.length) storageService.saveLogs(logs); }, [logs]);

  // Handlers
  const handleAddTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleUpdateTicketStatus = (id: string, status: TaskStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <DashboardHome tickets={tickets} assets={assets} logs={logs} />;
      case 'ops': 
        return <TaskManager tickets={tickets} onAddTicket={handleAddTicket} onUpdateStatus={handleUpdateTicketStatus} />;
      case 'schedule': 
        return <TimeSchedule tickets={tickets} />;
      case 'planner': 
        return <SmartPlanner tickets={tickets} logs={logs} assets={assets} onAddTicket={handleAddTicket} />;
      case 'assets': 
        return <AssetManager assets={assets} />;
      case 'finance': 
        return <FinanceView subscriptions={subscriptions} />; 
      case 'logs': 
        return <DailyLogView logs={logs} />;
      default: 
        return <DashboardHome tickets={tickets} assets={assets} logs={logs} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 overflow-hidden relative">
        {renderContent()}
        <AIAssistant tickets={tickets} logs={logs} />
      </main>
    </div>
  );
};

const FinanceView: React.FC<{subscriptions: Subscription[]}> = ({subscriptions}) => (
  <div className="p-6 h-full flex flex-col">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Subscriptions & Budget</h2>
    <p className="text-slate-500 text-sm mb-6">Manage your monthly recurring costs.</p>
    
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
          <tr>
            <th className="p-4">Vendor</th>
            <th className="p-4">Category</th>
            <th className="p-4">Business Owner</th>
            <th className="p-4">Renewal</th>
            <th className="p-4 text-right">Monthly Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
           {subscriptions.map((sub, i) => (
             <tr key={i}>
               <td className="p-4 font-medium text-slate-800">{sub.vendor}</td>
               <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{sub.category}</span></td>
               <td className="p-4 text-sm text-slate-600">{sub.owner}</td>
               <td className="p-4 text-sm text-slate-600">{sub.renewalDate}</td>
               <td className="p-4 text-sm font-mono text-right">${sub.costMonthly.toLocaleString()}</td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DailyLogView: React.FC<{logs: DailyLogItem[]}> = ({logs}) => (
  <div className="p-6 h-full flex flex-col">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Operations Log</h2>
    <p className="text-slate-500 text-sm mb-6">Routine checks for {new Date().toLocaleDateString()}.</p>

    <div className="space-y-4 max-w-3xl">
       {logs.map(log => (
         <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
           <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                log.status === 'Complete' ? 'bg-green-100 text-green-600' :
                log.status === 'Failed' ? 'bg-red-100 text-red-600' :
                'bg-slate-100 text-slate-400'
             }`}>
                {log.status === 'Complete' ? <CheckCircle2 size={20} /> :
                 log.status === 'Failed' ? <XCircle size={20} /> :
                 <div className="w-4 h-4 border-2 border-slate-400 rounded-full"></div>
                }
             </div>
             <div>
                <h4 className="font-medium text-slate-800">{log.task}</h4>
                <p className="text-xs text-slate-500">ID: {log.id} • {log.timestamp || 'Not started'}</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
              {log.status === 'Failed' && (
                 <button className="text-xs text-red-600 font-semibold border border-red-200 bg-red-50 px-3 py-1 rounded hover:bg-red-100">
                    Create Incident
                 </button>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                 log.status === 'Complete' ? 'bg-green-50 text-green-700' :
                 log.status === 'Failed' ? 'bg-red-50 text-red-700' :
                 'bg-slate-100 text-slate-600'
              }`}>
                {log.status.toUpperCase()}
              </span>
           </div>
         </div>
       ))}
    </div>
  </div>
);

export default App;
