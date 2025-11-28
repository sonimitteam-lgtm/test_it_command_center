import React, { useState } from 'react';
import { generateAIInsight } from '../services/geminiService';
import { MessageSquare, X, Send } from 'lucide-react';
import { Ticket, DailyLogItem } from '../types';

interface AIAssistantProps {
  tickets: Ticket[];
  logs: DailyLogItem[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ tickets, logs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: 'Hello! I am your IT Operations Assistant. I have access to your active tickets and logs. How can I help?'}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = `
      Active Tickets Summary: ${JSON.stringify(tickets.map(t => ({id: t.id, status: t.status, desc: t.description})))}
      Daily Log Summary: ${JSON.stringify(logs)}
    `;

    const response = await generateAIInsight(userMsg, context);
    
    setMessages(prev => [...prev, {role: 'ai', text: response}]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
       {/* Header */}
       <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
             <span className="font-semibold text-sm">Command AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
             <X size={18} />
          </button>
       </div>

       {/* Chat Area */}
       <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                   msg.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-br-none' 
                   : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white border border-slate-200 rounded-lg p-3 rounded-bl-none shadow-sm flex gap-1">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          )}
       </div>

       {/* Input */}
       <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input 
             type="text" 
             className="flex-1 bg-slate-100 border-0 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             placeholder="Ask about tickets or risks..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
             onClick={handleSend}
             disabled={isLoading}
             className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
             <Send size={18} />
          </button>
       </div>
    </div>
  );
};

export default AIAssistant;
