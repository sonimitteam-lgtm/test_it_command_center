
import React from 'react';
import { TaskStatus, Ticket } from '../types';
import { Clock, Calendar, ChevronLeft, ChevronRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { checkUrgency } from '../utils/timeUtils';

interface TimeScheduleProps {
  tickets: Ticket[];
}

const TimeSchedule: React.FC<TimeScheduleProps> = ({ tickets }) => {
  const todayTasks = tickets.filter(t => t.dueLocal.includes('Today') || t.isRecurring);

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Time Management</h2>
           <p className="text-slate-500 text-sm">Schedule & Workload Visualization</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
           <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={18} className="text-slate-600" /></button>
           <div className="flex items-center gap-2 px-2 text-sm font-medium text-slate-700">
              <Calendar size={14} />
              <span>Today, {new Date().toLocaleDateString()}</span>
           </div>
           <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={18} className="text-slate-600" /></button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex overflow-hidden">
         {/* Time Axis */}
         <div className="w-16 border-r border-slate-100 bg-slate-50 flex flex-col py-4">
             {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour => (
                 <div key={hour} className="flex-1 text-right pr-3 text-xs text-slate-400 font-medium relative group">
                    {hour}:00
                    <div className="absolute top-3 right-0 w-full h-px bg-slate-200 translate-x-full"></div>
                 </div>
             ))}
         </div>

         {/* Task Blocks */}
         <div className="flex-1 p-4 relative">
             {/* Background Lines */}
             <div className="absolute inset-0 pointer-events-none flex flex-col py-4 ml-4">
                {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour => (
                   <div key={hour} className="flex-1 border-t border-dashed border-slate-100 w-full"></div>
                ))}
             </div>

             {/* Events */}
             <div className="space-y-4">
                <div className="bg-indigo-100 border-l-4 border-indigo-500 p-3 rounded-r shadow-sm">
                   <div className="flex justify-between">
                      <h4 className="font-bold text-indigo-900 text-sm">Morning Maintenance & Recurring Checks</h4>
                      <span className="text-xs font-mono text-indigo-700">09:00 - 10:00</span>
                   </div>
                   <p className="text-xs text-indigo-700 mt-1">Review backups, logs, and server health.</p>
                </div>

                {todayTasks.filter(t => t.priority.includes('P1')).map(t => (
                  <div key={t.id} className="bg-orange-100 border-l-4 border-orange-500 p-3 rounded-r shadow-sm mt-8 relative">
                     <div className="absolute -left-3 top-[-10px] bg-red-600 text-white rounded-full p-1 shadow-sm">
                        <AlertTriangle size={12} />
                     </div>
                    <div className="flex justify-between">
                        <h4 className="font-bold text-orange-900 text-sm">{t.description}</h4>
                        <span className="text-xs font-mono text-orange-700">10:30 - 12:30</span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">Priority Incident Response</p>
                  </div>
                ))}

                 <div className="bg-slate-100 border-l-4 border-slate-400 p-3 rounded-r shadow-sm mt-16">
                   <div className="flex justify-between">
                      <h4 className="font-bold text-slate-700 text-sm">Lunch Break</h4>
                      <span className="text-xs font-mono text-slate-500">12:30 - 13:30</span>
                   </div>
                </div>

                <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded-r shadow-sm mt-8">
                   <div className="flex justify-between">
                      <h4 className="font-bold text-blue-900 text-sm">Project Work</h4>
                      <span className="text-xs font-mono text-blue-700">14:00 - 16:00</span>
                   </div>
                   <p className="text-xs text-blue-700 mt-1">Scheduled task block.</p>
                </div>
             </div>
         </div>
         
         {/* Unscheduled / Backlog Sidebar */}
         <div className="w-72 border-l border-slate-200 bg-slate-50 p-4 overflow-y-auto hidden lg:block">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Unscheduled Tasks</h3>
            <div className="space-y-3">
               {tickets.filter(t => !t.isRecurring && !t.priority.includes('P1') && t.status !== TaskStatus.RESOLVED).map(task => {
                 const urgency = checkUrgency(task.dueLocal);
                 const isOverdue = urgency === 'overdue';
                 const isSoon = urgency === 'soon';

                 return (
                    <div key={task.id} className={`
                       p-3 rounded border shadow-sm cursor-pointer transition-all
                       ${isOverdue ? 'bg-red-50 border-red-200 hover:border-red-400' : 
                         isSoon ? 'bg-amber-50 border-amber-200 hover:border-amber-400' : 
                         'bg-white border-slate-200 hover:border-blue-300'}
                    `}>
                       <div className="flex justify-between items-start mb-1">
                          <div className="text-xs font-mono text-slate-400">{task.timeEstimate || '30m'}</div>
                          {isOverdue && <div className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertCircle size={10} /> Overdue</div>}
                          {isSoon && <div className="text-xs font-bold text-amber-600 flex items-center gap-1"><Clock size={10} /> Due Soon</div>}
                       </div>
                       <p className={`text-sm font-medium leading-snug ${isOverdue ? 'text-red-900' : 'text-slate-700'}`}>{task.description}</p>
                       <div className="mt-2 flex justify-between text-xs text-slate-400">
                          <span>{task.id}</span>
                          <span>{task.priority.split(' - ')[0]}</span>
                       </div>
                    </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};

export default TimeSchedule;
