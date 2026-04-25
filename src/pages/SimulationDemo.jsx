import React, { useState, memo } from 'react';
import { Smartphone, PhoneCall, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SimulationDemo = memo(() => {
  const [smsInput, setSmsInput] = useState('');
  const [smsResponse, setSmsResponse] = useState(null);
  const [ivrStep, setIvrStep] = useState(0); // 0: call, 1: lang, 2: center, 3: service, 4: success

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    if (smsInput.trim() === '') return;
    
    if (smsInput.toUpperCase().includes('QUEUE')) {
      setSmsResponse({
        text: "Your token BLR-HOSP-0042 is confirmed. Visit at 11:30 AM. Status: Waiting (12 ahead).",
        time: "Just now"
      });
    } else {
      setSmsResponse({
        text: "Invalid command. Type QUEUE <CENTER_CODE> <SERVICE> to book.",
        time: "Just now"
      });
    }
    setSmsInput('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12 lg:p-20 font-outfit overflow-y-auto">
      <header className="mb-10 md:mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tighter">Multi-Channel Simulation</h1>
        <p className="text-slate-500 italic text-sm md:text-lg font-medium">Inclusive queuing for non-smartphone users</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        
        {/* SMS Booking Simulation */}
        <div className="glass-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 flex flex-col h-[500px] md:h-[600px] shadow-xl hover:shadow-gold/10 transition-shadow">
           <div className="flex items-center gap-3 mb-6 md:mb-8">
             <div className="p-2 md:p-3 bg-secondary/10 rounded-xl md:rounded-2xl text-secondary">
               <Smartphone size={24} />
             </div>
             <h2 className="text-xl md:text-2xl font-black text-slate-900">SMS Booking</h2>
           </div>

           <div className="flex-grow space-y-4 overflow-y-auto mb-4 md:mb-6 p-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 shadow-inner">
              <div className="flex flex-col items-end">
                <div className="bg-primary text-white p-3 md:p-4 rounded-2xl rounded-tr-none text-xs md:text-sm font-bold shadow-sm">
                  QUEUE BLR HOSPITAL OPD
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Sent 10:45 AM</span>
              </div>

              {smsResponse && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-start">
                  <div className="bg-white p-3 md:p-4 rounded-2xl rounded-tl-none text-xs md:text-sm border border-slate-200 text-slate-700 font-medium shadow-sm">
                    {smsResponse.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">{smsResponse.time}</span>
                </motion.div>
              )}
           </div>

           <form onSubmit={handleSmsSubmit} className="relative">
             <input 
               type="text" 
               value={smsInput}
               onChange={(e) => setSmsInput(e.target.value)}
               placeholder="Type QUEUE BLR..." 
               className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 md:py-4 pl-6 pr-14 outline-none focus:border-primary transition-colors text-sm font-bold text-slate-700"
             />
             <button type="submit" className="absolute right-2 top-2 p-1.5 md:p-2 bg-primary rounded-full text-white shadow-gold hover:scale-105 active:scale-95 transition-transform">
               <Send size={18} />
             </button>
           </form>
        </div>

        {/* IVR Booking Simulation */}
        <div className="glass-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 flex flex-col h-[500px] md:h-[600px] items-center text-center shadow-xl hover:shadow-gold/10 transition-shadow">
           <div className="flex items-center gap-3 mb-6 md:mb-8 w-full text-left">
             <div className="p-2 md:p-3 bg-green-500/10 rounded-xl md:rounded-2xl text-green-500">
               <PhoneCall size={24} />
             </div>
             <h2 className="text-xl md:text-2xl font-black text-slate-900">IVR Voice System</h2>
           </div>

           <AnimatePresence mode="wait">
             {ivrStep === 0 && (
               <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 md:gap-8 my-auto">
                 <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                   <PhoneCall size={32} md:size={40} className="text-white" />
                 </div>
                 <button onClick={() => setIvrStep(1)} className="m3-button bg-green-500 text-white shadow-lg shadow-green-500/30 px-8 md:px-12 py-3 md:py-4 font-bold text-sm md:text-base hover:scale-105 transition-transform">Start IVR Call</button>
               </motion.div>
             )}

             {ivrStep === 1 && (
               <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 md:gap-6 my-auto">
                 <p className="text-lg md:text-2xl italic text-slate-500 font-medium">"Press 1 for English, 2 for Kannada"</p>
                 <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-[200px] md:max-w-[240px] mx-auto">
                   {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n => (
                     <button key={n} onClick={() => setIvrStep(2)} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-lg md:text-xl font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90 shadow-sm">
                       {n}
                     </button>
                   ))}
                 </div>
               </motion.div>
             )}

             {ivrStep === 2 && (
               <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 my-auto">
                 <p className="text-lg md:text-2xl italic text-slate-500 font-medium">"Press 1 for BBMP Office, 2 for Victoria Hospital"</p>
                 <div className="flex justify-center gap-4">
                   <button onClick={() => setIvrStep(3)} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 border border-slate-200 text-2xl md:text-3xl font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">1</button>
                   <button onClick={() => setIvrStep(3)} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 border border-slate-200 text-2xl md:text-3xl font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">2</button>
                 </div>
               </motion.div>
             )}

             {ivrStep === 3 && (
               <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 my-auto">
                 <p className="text-lg md:text-2xl italic text-slate-500 font-medium">"Press 1 for Aadhaar, 2 for Bill Payment"</p>
                 <div className="flex justify-center gap-4">
                   <button onClick={() => setIvrStep(4)} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 border border-slate-200 text-2xl md:text-3xl font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">1</button>
                   <button onClick={() => setIvrStep(4)} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 border border-slate-200 text-2xl md:text-3xl font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">2</button>
                 </div>
               </motion.div>
             )}

             {ivrStep === 4 && (
               <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 md:gap-6 my-auto">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900">Token Confirmed</h3>
                  <p className="text-sm md:text-lg text-slate-500 italic font-medium">"Your token is 42. Visit at 11:30 AM."</p>
                  <button onClick={() => setIvrStep(0)} className="text-[10px] md:text-xs text-slate-400 mt-6 md:mt-8 uppercase font-black tracking-widest hover:text-primary transition-colors border-b border-transparent hover:border-primary">Hang Up</button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
        Simulation mode for concept verification
      </div>
    </div>
  );
});

export default SimulationDemo;
