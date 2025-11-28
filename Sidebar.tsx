import React from 'react';
import { LayoutDashboard, ListTodo, BrainCircuit, Server, CreditCard, Activity, Command, CalendarClock } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ops', label: 'Task Manager', icon: ListTodo },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock },
    { id: 'planner', label: 'Smart Planner', icon: BrainCircuit },
    { id: 'assets', label: 'Asset DB', icon: Server },
    { id: 'finance', label: 'Subscriptions', icon: CreditCard },
    { id: 'logs', label: 'Daily Logs', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800 shadow-xl fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Command className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">IT Command</h1>
          <p className="text-xs text-slate-400">Center</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
            ME
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Administrator</p>
            <p className="text-xs text-slate-500">System Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;