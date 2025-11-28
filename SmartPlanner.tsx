import React, { useState } from 'react';
import { Ticket, Asset, DailyLogItem, Priority, TaskStatus, LocationType } from '../types';
import { BrainCircuit, CheckSquare, Sparkles, PlusCircle, Lightbulb } from 'lucide-react';
import { generateAIInsight } from '../services/geminiService';

interface SmartPlannerProps {
  tickets: Ticket[];
  logs: DailyLogItem[];
  assets: Asset[];
  onAddTicket: (t: Ticket) => void;
}

const SmartPlanner: React.FC<SmartPlannerProps> = ({ tickets, logs, assets, onAddTicket }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [parsedTask, setParsedTask] = useState<string>('');

  const handleSuggestTasks = async () => {
    setLoading(true);
    const context = `
      Open Tickets: ${tickets.length} (Critical: ${tickets.filter(t => t.priority.includes('P1')).length})
      Daily Log Failures: ${logs.filter(l => l.status === 'Failed').map(l => l.task).join(', ')}
      Overdue Assets: ${assets.filter(a => a.lifecycleStatus === 'Overdue').length}
    `;
    
    const prompt = "As a solo IT manager's assistant, analyze the context. Suggest 2 immediate firefighting tasks and 1 long-term improvement task. Format them as a simple numbered list.";
    
    const result = await generateAIInsight(prompt, context);
    const list = result.split(/\d+\.\s/).filter(i => i.trim().length > 0);
    setSuggestions(list.length > 0 ? list : [result]);
    setLoading(false);
  };

  const handleSmartAdd = async () => {
     if(!quickNote) return;
     setLoading(true);
     const result = await generateAIInsight(
       `Convert this rough note into a structured ticket format. Return ONLY a JSON string with keys: description, priority (one of "P1 - Critical", "P2 - High", "P3 - Standard", "P4 - Low"). rough note: "${quickNote}"`, 
       "User is a solo IT admin. Output strict JSON."
     );
     
     try {
       // Strip markdown if AI adds it
       const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
       const parsed = JSON.parse(cleanJson);
       
       const newTicket: Ticket = {
          id: `AI-${Math.floor(Math.random()*1000)}`,
          createdUtc: new Date().toISOString(),
          description: parsed.description,
          priority: parsed.priority || Priority.P3,
          category: 'General',
          location: LocationType.OFFICE,
          status: TaskStatus.OPEN,
          dueLocal: 'Tomorrow',
          timeEstimate: '1h'
       };
       onAddTicket(newTicket);
       setQuickNote('');
       setParsedTask('Task created successfully!');
       setTimeout(() => setParsedTask(''), 3000);
     } catch (e) {
       setParsedTask('Failed to parse AI response. Task added as plain text.');
       onAddTicket({
          id: `QUICK-${Math.floor(Math.random()*1000)}`,
          createdUtc: new Date().toISOString(),
          description: quickNote,
          priority: Priority.P3,
          category: 'General',
          location: LocationType.OFFICE,
          status: TaskStatus.OPEN,
          dueLocal: 'Today'
       });
       setQuickNote('');
     }
     setLoading(false);
  };

  const handleAddSuggestion = (desc: string) => {
    onAddTicket({
      id: `SUG-${Math.floor(Math.random()*1000)}`,
      createdUtc: new Date().toISOString(),
      description: desc.slice(0, 100) + '...', // truncate
      priority: Priority.P3,
      category: 'General',
      location: LocationType.OFFICE,
      status: TaskStatus.OPEN,
      dueLocal: 'Next Week'
    });
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Smart Planner</h2>
           <p className="text-slate-500 text-sm">AI-driven task prioritization & suggestions.</p>
        </div>
        <button 
           onClick={handleSuggestTasks}
           disabled={loading}
           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Suggest Tasks & Improvements'}
          {!loading && <Sparkles size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Suggestion Panel */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-fit min-h-[300px]">
            <div className="p-4 bg-purple-50 border-b border-purple-100">
               <h3 className="font-semibold text-purple-800 flex items-center gap-2">
                 <BrainCircuit className="w-5 h-5" /> AI Recommended Actions
               </h3>
            </div>
            <div className="p-6 space-y-4">
               {loading && suggestions.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                     <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-2"></div>
                     <p className="text-sm">Reviewing assets & logs...</p>
                  </div>
               )}
               
               {!loading && suggestions.length === 0 && (
                  <div className="text-center text-slate-400 py-10">
                    Click "Suggest Tasks" to analyze your environment for risks and improvements.
                  </div>
               )}

               {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                     <div className={`p-2 rounded-lg mt-0.5 ${idx === 2 ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                        {idx === 2 ? <Lightbulb size={18} /> : <CheckSquare size={18} />}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {idx === 2 ? 'Process Improvement' : 'Immediate Action'}
                            </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{suggestion}</p>
                        <button onClick={() => handleAddSuggestion(suggestion)} className="text-blue-600 text-xs font-medium mt-2 hover:underline">+ Add to Task List</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Smart Add Panel */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-fit">
             <div className="p-4 bg-slate-50 border-b border-slate-200">
               <h3 className="font-semibold text-slate-700">Quick Capture</h3>
            </div>
            <div className="p-6">
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Rough Notes / Brain Dump</label>
               <div className="flex gap-2 mb-4">
                 <input 
                    type="text"
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 'Printer in HR needs toner and check firmware'"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSmartAdd()}
                 />
                 <button 
                   onClick={handleSmartAdd}
                   className="bg-slate-800 text-white px-4 rounded-lg hover:bg-slate-700"
                 >
                   <PlusCircle size={20} />
                 </button>
               </div>

               {parsedTask && (
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold">{parsedTask}</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SmartPlanner;
