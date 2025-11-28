
import React, { useState } from 'react';
import { Priority, TaskStatus, Ticket, LocationType } from '../types';
import { Filter, Plus, Search, CheckCircle2, RotateCw, Clock, CalendarDays, List, X, AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import { checkUrgency } from '../utils/timeUtils';

interface TaskManagerProps {
  tickets: Ticket[];
  onAddTicket: (t: Ticket) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tickets, onAddTicket, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Recurring' | 'Project'>('All');
  const [isAdding, setIsAdding] = useState(false);
  
  // New Task Form State
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState(Priority.P3);
  const [newTime, setNewTime] = useState('30m');
  const [newType, setNewType] = useState<'Project'|'Recurring'>('Project');
  const [newDue, setNewDue] = useState('Today 17:00');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' ? true : 
                        filterType === 'Recurring' ? ticket.isRecurring : 
                        !ticket.isRecurring;
    return matchesSearch && matchesType;
  });

  const recurringTasks = filteredTickets.filter(t => t.isRecurring);
  const projectTasks = filteredTickets.filter(t => !t.isRecurring);

  const handleCreateTask = () => {
    if(!newDesc) return;
    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random()*10000)}`,
      createdUtc: new Date().toISOString(),
      priority: newPriority,
      category: 'General',
      description: newDesc,
      location: LocationType.OFFICE,
      status: TaskStatus.OPEN,
      dueLocal: newDue,
      timeEstimate: newTime,
      isRecurring: newType === 'Recurring'
    };
    onAddTicket(newTicket);
    setIsAdding(false);
    setNewDesc('');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Task Tracker</h2>
           <p className="text-slate-500 text-sm">Manage daily maintenance and projects.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow transition">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-blue-100 p-4 rounded-xl mb-6 shadow-sm animate-in slide-in-from-top-4">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Create New Task</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                 <input autoFocus type="text" className="w-full border border-slate-300 rounded p-2 text-sm" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What needs doing?" />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Priority</label>
                 <select className="w-full border border-slate-300 rounded p-2 text-sm" value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}>
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Due</label>
                 <input type="text" className="w-full border border-slate-300 rounded p-2 text-sm" value={newDue} onChange={e => setNewDue(e.target.value)} placeholder="e.g. Today 14:00" />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
                 <select className="w-full border border-slate-300 rounded p-2 text-sm" value={newType} onChange={e => setNewType(e.target.value as any)}>
                    <option value="Project">One-off Project</option>
                    <option value="Recurring">Daily Recurring</option>
                 </select>
              </div>
           </div>
           <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
              <button onClick={handleCreateTask} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Task</button>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex gap-4 items-center flex-wrap bg-slate-50">
           <div className="relative flex-1 min-w-[200px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search tasks..." 
               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-1">
             <button 
               onClick={() => setFilterType('All')}
               className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filterType === 'All' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               All
             </button>
             <button 
               onClick={() => setFilterType('Recurring')}
               className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${filterType === 'Recurring' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               <RotateCw size={12} /> Daily
             </button>
             <button 
               onClick={() => setFilterType('Project')}
               className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${filterType === 'Project' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               <List size={12} /> Project
             </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          
          {/* Daily Reminders Section */}
          {(filterType === 'All' || filterType === 'Recurring') && recurringTasks.length > 0 && (
             <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                   <RotateCw size={14} className="text-indigo-500" /> Daily Reminders & Maintenance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recurringTasks.map(task => {
                    const urgency = checkUrgency(task.dueLocal);
                    const isResolved = task.status === TaskStatus.RESOLVED;
                    const isOverdue = urgency === 'overdue' && !isResolved;
                    
                    return (
                      <div key={task.id} className={`
                        border rounded-lg p-4 flex items-start gap-3 hover:shadow-sm transition-shadow
                        ${isResolved ? 'bg-slate-50 border-slate-100 opacity-70' : 
                          isOverdue ? 'bg-red-50 border-red-200' : 
                          'bg-indigo-50 border-indigo-100'}
                      `}>
                         <button onClick={() => onUpdateStatus(task.id, TaskStatus.RESOLVED)} className={`mt-1 hover:text-indigo-600 transition-colors ${task.status === TaskStatus.RESOLVED ? 'text-green-500' : 'text-indigo-300'}`}>
                            <CheckCircle2 size={20} />
                         </button>
                         <div className="flex-1">
                            <h4 className={`text-sm font-semibold ${isOverdue ? 'text-red-800' : 'text-slate-800'} ${isResolved ? 'line-through' : ''}`}>
                              {task.description}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-indigo-600">
                               <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-indigo-100">
                                 <Clock size={12} /> {task.timeEstimate || '15m'}
                               </span>
                               <span className={`flex items-center gap-1 ${isOverdue ? 'font-bold text-red-600' : ''}`}>
                                  {isOverdue && <AlertCircle size={12} />}
                                  Due: {task.dueLocal}
                               </span>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          )}

          {/* Project Tasks Section */}
          {(filterType === 'All' || filterType === 'Project') && (
            <div>
               {(filterType === 'All' && recurringTasks.length > 0) && <div className="border-t border-slate-200 my-6"></div>}
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                   <CalendarDays size={14} className="text-blue-500" /> Active Tasks / Backlog
                </h3>
               <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-10"></th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">ID</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Priority</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-1/3">Description</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Est. Time</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projectTasks.map((ticket) => {
                        const urgency = checkUrgency(ticket.dueLocal);
                        const isResolved = ticket.status === TaskStatus.RESOLVED;
                        const isOverdue = urgency === 'overdue' && !isResolved;
                        const isSoon = urgency === 'soon' && !isResolved;

                        return (
                          <tr key={ticket.id} className={`
                            hover:bg-slate-50 transition-colors group
                            ${isOverdue ? 'bg-red-50 hover:bg-red-100' : isSoon ? 'bg-amber-50 hover:bg-amber-100' : ''}
                          `}>
                            <td className={`p-4 ${isOverdue ? 'border-l-4 border-l-red-500' : isSoon ? 'border-l-4 border-l-amber-500' : ''}`}>
                              <button onClick={() => onUpdateStatus(ticket.id, TaskStatus.RESOLVED)} className={`transition-colors ${ticket.status === TaskStatus.RESOLVED ? 'text-green-500' : 'text-slate-300 hover:text-green-500'}`}>
                                  <CheckCircle2 size={18} />
                              </button>
                            </td>
                            <td className="p-4 font-mono text-xs text-slate-600 font-medium">{ticket.id}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                ticket.priority === Priority.P1 ? 'bg-red-100 text-red-800 border border-red-200' :
                                ticket.priority === Priority.P2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {ticket.priority.split(' - ')[0]}
                              </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-start gap-2">
                                  {isOverdue && <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />}
                                  {isSoon && <Zap className="text-amber-500 shrink-0 mt-0.5" size={16} />}
                                  <div className={`text-sm font-medium ${isOverdue ? 'text-red-900' : 'text-slate-800'} ${isResolved ? 'line-through opacity-50' : ''}`}>
                                    {ticket.description}
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-500">{ticket.category}</span>
                                  {ticket.dueLocal && (
                                    <span className={`text-xs px-1.5 rounded flex items-center gap-1 ${isOverdue ? 'bg-red-200 text-red-800' : isSoon ? 'bg-amber-200 text-amber-800' : 'text-slate-400'}`}>
                                      {ticket.dueLocal}
                                    </span>
                                  )}
                                </div>
                            </td>
                            <td className="p-4 text-xs text-slate-500 font-mono">
                               {ticket.timeEstimate ? (
                                 <span className="flex items-center gap-1"><Clock size={12} /> {ticket.timeEstimate}</span>
                               ) : '-'}
                            </td>
                            <td className="p-4">
                              <StatusBadge status={ticket.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
               </div>
            </div>
          )}
          
          {filteredTickets.length === 0 && (
            <div className="p-10 text-center text-slate-400">
               No tasks found matching your filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{status: TaskStatus}> = ({status}) => {
  const styles = {
    [TaskStatus.OPEN]: 'bg-slate-100 text-slate-700 border-slate-200',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TaskStatus.WAITING]: 'bg-purple-100 text-purple-700 border-purple-200',
    [TaskStatus.RESOLVED]: 'bg-green-100 text-green-700 border-green-200',
    [TaskStatus.CLOSED]: 'bg-gray-100 text-gray-400 border-gray-200',
    [TaskStatus.HANDOVER]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default TaskManager;
