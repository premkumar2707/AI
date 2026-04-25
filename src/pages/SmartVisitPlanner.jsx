import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ShieldCheck, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

const SmartVisitPlanner = () => {
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 md:p-20 font-outfit overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} /> AI Powered Planning
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Smart Visit Planner</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Input your visit details and let Gemini predict the best time to skip the long queues.
          </p>
        </header>

        <div className="glass-white p-8 md:p-12 rounded-[40px] border border-slate-100 space-y-8 shadow-xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Select Center</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary appearance-none font-bold text-slate-700">
                   <option>Cauvery Bhavan (Bangalore One)</option>
                   <option>Victoria Hospital</option>
                   <option>BBMP Head Office</option>
                   <option>Sunkadakatte Bangalore One</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Visit Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary font-bold text-slate-700"
                />
              </div>
           </div>

           <button 
             onClick={() => setShowPlan(true)}
             className="w-full m3-button m3-button-gold py-6 justify-center text-2xl shadow-gold"
           >
             Generate Smart Plan
           </button>
        </div>

        {showPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <PlanCard 
              icon={<Clock size={24} className="text-green-500" />} 
              label="Best Time to Visit" 
              value="02:30 PM - 03:45 PM" 
              sub="Historical data shows lowest crowd after lunch."
            />
            <PlanCard 
              icon={<AlertTriangle size={24} className="text-amber-500" />} 
              label="Expected Crowd" 
              value="Moderate" 
              sub="Approx. 15-20 people in queue."
            />
            <PlanCard 
              icon={<ShieldCheck size={24} className="text-blue-500" />} 
              label="Required Documents" 
              value="3 Documents" 
              sub="Aadhaar, Address Proof, Photo."
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const PlanCard = memo(({ icon, label, value, sub }) => (
  <div className="glass-white p-8 rounded-[32px] border border-slate-100 space-y-4 hover:border-primary/30 transition-colors shadow-lg">
    <div className="p-3 bg-slate-50 rounded-2xl w-fit shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed font-medium">{sub}</p>
  </div>
));

export default SmartVisitPlanner;
