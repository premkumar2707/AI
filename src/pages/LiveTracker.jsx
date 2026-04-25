import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, Bell, BellOff, MessageSquare, Mic, Sparkles, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveTracker = () => {
  const [position, setPosition] = useState(12);
  const [total, setTotal] = useState(45);
  const [notifications, setNotifications] = useState(true);

  // Simulation of queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev > 1 ? prev - 1 : 1));
    }, 15000); // Every 15 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const progress = ((total - position) / total) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12 font-outfit overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <Link to="/find-centers" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm">
          <ChevronLeft size={24} className="text-slate-600" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Live Status</h1>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Token: BLR-HOSP-2024-0042</p>
        </div>
        <button 
          onClick={() => setNotifications(!notifications)}
          className={`p-3 rounded-full transition-all border shadow-sm ${notifications ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
        >
          {notifications ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        {/* Progress Ring Section */}
        <div className="relative flex flex-col items-center glass-white p-10 rounded-[40px] border border-slate-100 shadow-xl">
          <div className="relative w-64 h-64">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="16"
                fill="transparent"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="128"
                cy="128"
                r={radius}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-primary drop-shadow-md"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Your Position</span>
               <span className="text-7xl font-black text-slate-900">{position}</span>
               <div className="flex items-center gap-1 mt-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live</span>
               </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <h2 className="text-4xl font-black text-slate-900">~{position * 4} Minutes</h2>
            <p className="text-slate-500 flex items-center justify-center gap-2 font-medium">
              <Clock size={18} className="text-secondary" /> Estimated Wait Time
            </p>
            <div className="pt-2">
               <span className="text-[9px] bg-primary/5 px-4 py-1.5 rounded-full text-primary font-black uppercase tracking-widest border border-primary/20">
                 AI Predicted by Gemini
               </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-white p-8 rounded-[32px] border border-slate-100 text-center shadow-lg hover:border-primary/20 transition-colors">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Serving Now</p>
            <p className="text-5xl font-black text-slate-900">#41</p>
            <div className="mt-4 inline-block px-3 py-1 bg-secondary/10 rounded-lg text-[10px] text-secondary font-black uppercase tracking-widest">
              Counter 03
            </div>
          </div>
          <div className="glass-white p-8 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center shadow-lg hover:border-primary/20 transition-colors">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <QRCodeSVG 
                value="BLR-HOSP-2024-0042" 
                size={80} 
                fgColor="#0f172a" 
                bgColor="#ffffff" 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black">Scan at Counter</p>
          </div>
        </div>

        {/* Smart Planner Teaser */}
        <div className="bg-gradient-to-br from-secondary/10 to-transparent p-8 rounded-[32px] border border-secondary/20 shadow-lg">
           <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
             <Sparkles size={24} className="text-secondary" /> Smart Visit Planner
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-500">Expected Crowd Level</span>
               <span className="text-amber-500 font-black px-3 py-1 bg-amber-50 rounded-lg">Moderate</span>
             </div>
             <div className="flex justify-between items-center text-sm font-medium">
               <span className="text-slate-500">Best Time to Visit</span>
               <span className="text-green-500 font-black px-3 py-1 bg-green-50 rounded-lg">After 2:30 PM</span>
             </div>
             <div className="pt-6 mt-6 border-t border-secondary/10">
               <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Required Documents:</p>
               <div className="flex flex-wrap gap-2">
                 {['Original Aadhaar', 'Address Proof', '2 Photos'].map(doc => (
                   <span key={doc} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white text-slate-600 rounded-lg border border-slate-200 shadow-sm">
                     {doc}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LiveTracker);
