import React, { useState } from 'react';
import { MOCK_TICKETS } from '../constants';
import { TaskStatus } from '../types';
import { ArrowRightCircle, CheckCircle2, Copy } from 'lucide-react';
import { generateAIInsight } from '../services/geminiService';

const HandoverLog: React.FC = () => {
  const handoverTasks = MOCK_TICKETS.filter(t => t.status === TaskStatus.HANDOVER);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const context = JSON.stringify(handoverTasks.map(t => ({
       id: t.id, 
       description: t.description, 
       note: t.handoverNote, 
       region: t.region
    })));
    
    const summary = await generateAIInsight(
      "Draft a professional shift handover email summary highlighting critical items and action needed for the incoming team.",
      context
    );
    setAiSummary(summary);
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Shift Handover Protocol</h2>
           <p className="text-slate-500 text-sm">Transferring context between regions.</p>
        </div>
        <button 
           onClick={handleGenerateSummary}
           disabled={loading}
           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'AI Draft Handover Note'}
          {!loading && <ArrowRightCircle size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
         {/* Incoming Tasks */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[calc(100vh-12rem)]">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
               <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                 Active Handover Items ({handoverTasks.length})
               </h3>
            </div>
            <div className="overflow-auto p-4 space-y-4">
              {handoverTasks.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">No items in Handover status.</div>
              ) : (
                handoverTasks.map(task => (
                  <div key={task.id} className="p-4 border border-purple-100 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-mono text-xs text-purple-700 bg-purple-200 px-2 py-0.5 rounded">{task.id}</span>
                       <span className="text-xs text-slate-500">From: {task.region}</span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-2">{task.description}</h4>
                    <div className="text-sm text-slate-600 bg-white p-3 rounded border border-purple-100 italic">
                      " {task.handoverNote} "
                    </div>
                    <div className="mt-3 flex justify-end">
                       <button className="text-xs font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Acknowledge
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>

         {/* AI Summary / Draft Area */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-12rem)]">
             <div className="p-4 bg-slate-50 border-b border-slate-200">
               <h3 className="font-semibold text-slate-700">Handover Summary (Draft)</h3>
            </div>
            <div className="flex-1 p-4 relative">
               <textarea 
                  className="w-full h-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm leading-relaxed"
                  placeholder="Generate a summary using the AI button, or type notes here..."
                  value={aiSummary}
                  onChange={(e) => setAiSummary(e.target.value)}
               ></textarea>
               {aiSummary && (
                 <button 
                  className="absolute bottom-6 right-6 bg-white border border-slate-200 shadow-sm p-2 rounded-lg hover:bg-slate-50 text-slate-600"
                  title="Copy to Clipboard"
                  onClick={() => navigator.clipboard.writeText(aiSummary)}
                 >
                   <Copy size={16} />
                 </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HandoverLog;