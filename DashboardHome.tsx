import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Server, TrendingUp, Clock, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { Ticket, Asset, DailyLogItem } from '../types';
import { generateAIInsight } from '../services/geminiService';

interface DashboardProps {
  tickets: Ticket[];
  assets: Asset[];
  logs: DailyLogItem[];
}

const DashboardHome: React.FC<DashboardProps> = ({ tickets, assets, logs }) => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Stats
  const ticketStats = [
    { name: 'Open', count: tickets.filter(t => t.status === 'Open').length },
    { name: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length },
    { name: 'Waiting', count: tickets.filter(t => t.status === 'Waiting for Vendor').length },
  ];

  const criticalCount = tickets.filter(t => t.priority === 'P1 - Critical').length;

  const costData = [
    { month: 'May', total: 6400 },
    { month: 'Jun', total: 6398 },
    { month: 'Jul', total: 11800 },
    { month: 'Aug', total: 6688 },
    { month: 'Sep', total: 6690 },
    { month: 'Oct', total: 6190 },
  ];

  const assetHealth = [
    { name: 'Healthy', value: assets.filter(a => a.lifecycleStatus === 'Healthy').length },
    { name: 'Refresh Needed', value: assets.filter(a => a.lifecycleStatus !== 'Healthy').length },
  ];
  const COLORS = ['#10b981', '#f59e0b'];

  const handleSendDailyReport = async () => {
    setEmailSending(true);
    
    // Simulate AI drafting and sending
    const context = `
      Open P1 Tickets: ${criticalCount}
      Failed Daily Logs: ${logs.filter(l => l.status === 'Failed').length}
      Asset Health: ${assetHealth[0].value} Healthy, ${assetHealth[1].value} Warning
    `;
    
    await generateAIInsight("Draft a very short executive summary email subject line and 1 sentence body for today's IT status.", context);
    
    setTimeout(() => {
        setEmailSending(false);
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
          <p className="text-slate-500 text-sm">Overview of your single-person IT environment.</p>
        </div>
        <div className="flex gap-4">
           {criticalCount > 0 && (
             <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 flex items-center gap-2 animate-pulse">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">{criticalCount} Critical Task(s)</span>
             </div>
           )}
           
           <button 
             onClick={handleSendDailyReport}
             disabled={emailSending || emailSent}
             className={`px-4 py-2 rounded-lg shadow border flex items-center gap-2 transition-colors ${
                emailSent 
                ? 'bg-green-100 border-green-200 text-green-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
             }`}
           >
              {emailSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold">Generating Report...</span>
                  </>
              ) : emailSent ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold">Report Sent</span>
                  </>
              ) : (
                  <>
                    <Mail size={18} />
                    <span className="text-sm font-semibold">Send Daily Report</span>
                  </>
              )}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Workload */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Current Workload
            </h3>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Health */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-500" /> Asset Health
            </h3>
          </div>
          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetHealth}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-700">
                  {assets.length}
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-slate-400">
                  Total Assets
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {assetHealth.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spend Trend */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Spend Trend
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority List */}
        <div className="col-span-12 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" /> Immediate Focus
          </h3>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Task ID</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.sort((a,b) => a.priority.localeCompare(b.priority)).slice(0, 5).map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{ticket.id}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.priority.includes('P1') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.priority.split(' - ')[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3">{ticket.description}</td>
                      <td className="px-4 py-3">{ticket.dueLocal}</td>
                      <td className="px-4 py-3">{ticket.status}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
