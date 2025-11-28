import React from 'react';
import { Asset } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface AssetManagerProps {
  assets: Asset[];
}

const AssetManager: React.FC<AssetManagerProps> = ({ assets }) => {
  // Aggregate data for lifecycle chart
  const statusCounts = [
    { name: 'Healthy', count: assets.filter(a => a.lifecycleStatus === 'Healthy').length },
    { name: 'Plan Refresh', count: assets.filter(a => a.lifecycleStatus === 'Plan Refresh').length },
    { name: 'Overdue', count: assets.filter(a => a.lifecycleStatus === 'Overdue').length },
  ];

  const totalValue = assets.reduce((acc, curr) => acc + curr.costUsd, 0);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Asset Lifecycle Database</h2>
           <p className="text-slate-500 text-sm">Hardware inventory & depreciation tracking.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
           <span className="text-xs text-slate-500 block uppercase">Total Asset Value (USD)</span>
           <span className="text-xl font-bold text-slate-800">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
         {/* Lifecycle Chart */}
         <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">Lifecycle Distribution</h3>
            <div className="h-40">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={statusCounts} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         {/* Key Alerts */}
         <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-semibold text-slate-700 mb-4">Stock Alerts</h3>
             <div className="flex gap-4">
                <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3">
                   <AlertTriangle className="text-red-600" />
                   <div>
                      <p className="font-bold text-red-800">Low Stock: India</p>
                      <p className="text-xs text-red-600">Only 2 Laptops remaining in Bangalore.</p>
                   </div>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center gap-3">
                   <RefreshCw className="text-amber-600" />
                   <div>
                      <p className="font-bold text-amber-800">Refresh Due: Q4</p>
                      <p className="text-xs text-amber-600">5 Assets marked for replacement.</p>
                   </div>
                </div>
             </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden">
        <div className="overflow-auto h-full">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tag</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Model</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Lifecycle</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr key={asset.tag} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs font-medium text-slate-700">{asset.tag}</td>
                  <td className="p-4 text-sm text-slate-800">{asset.model}</td>
                  <td className="p-4 text-sm text-slate-600">{asset.type}</td>
                  <td className="p-4 text-sm text-slate-600">{asset.location}</td>
                  <td className="p-4 text-sm text-slate-600">{asset.assignedUser}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                       asset.lifecycleStatus === 'Healthy' ? 'bg-green-100 text-green-700' :
                       asset.lifecycleStatus === 'Plan Refresh' ? 'bg-amber-100 text-amber-700' :
                       'bg-red-100 text-red-700'
                    }`}>
                      {asset.lifecycleStatus === 'Healthy' && <Check size={12} />}
                      {asset.lifecycleStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-700 text-right">${asset.costUsd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
