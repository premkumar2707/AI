import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, X, Send, Sparkles, User, Mic, PhoneOff } from 'lucide-react';

const GlobalTools = memo(() => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste! I am your QueueSmart AI. How can I help you skip the queue today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulated AI Response
    setTimeout(() => {
      let response = "I'm analyzing real-time data for you...";
      if (input.toLowerCase().includes('document')) response = "For most services in Bangalore, you'll need your Original Aadhaar, Address Proof, and 2 passport photos.";
      if (input.toLowerCase().includes('sunkadakatte')) response = "Sunkadakatte Bangalore One is currently seeing moderate traffic. Estimated wait is 28 minutes.";
      if (input.toLowerCase().includes('wait')) response = "Average wait times across Bangalore are currently 35% lower than usual. It's a great time to visit!";
      
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCalling(true)}
          className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-blue"
        >
          <Phone size={28} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-gold"
        >
          <MessageSquare size={28} />
        </motion.button>
      </div>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-100"
          >
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={20} /></div>
                <div>
                  <h3 className="font-black text-lg">QueueSmart AI</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm font-medium text-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-6 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-14 outline-none focus:border-primary font-bold text-slate-700"
                />
                <button type="submit" className="absolute right-2 top-2 p-2 bg-primary text-white rounded-full shadow-gold">
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Simulation Overlay */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/95 z-[200] flex flex-col items-center justify-center text-white"
          >
            <div className="space-y-12 text-center">
              <div className="space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <Phone size={48} />
                </motion.div>
                <h2 className="text-4xl font-black">1800-425-QUEU</h2>
                <p className="text-xl font-medium text-white/70">Connecting to Bangalore Helpdesk...</p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                 <CallAction icon={<Mic />} label="Mute" />
                 <CallAction icon={<User />} label="Speaker" />
                 <CallAction icon={<MessageSquare />} label="Keypad" />
              </div>

              <button 
                onClick={() => setIsCalling(false)}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
              >
                <PhoneOff size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

const CallAction = memo(({ icon, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</span>
  </div>
));

export default GlobalTools;
