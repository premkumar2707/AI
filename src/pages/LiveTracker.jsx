import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, Bell, BellOff, MessageSquare, Mic, Sparkles, ChevronLeft, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LiveTracker = () => {
  const { user, tokens } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  // Find active token
  const activeToken = tokens?.find(t => t.status === 'waiting');
  
  // If no active token, simulate position or show nothing
  const [position, setPosition] = useState(activeToken?.estimatedWait ? Math.ceil(activeToken.estimatedWait / 4) : 12);
  const total = 45;

  // Simulation of queue movement
  useEffect(() => {
    if (!activeToken) return;
    const interval = setInterval(() => {
      setPosition(prev => (prev > 1 ? prev - 1 : 1));
    }, 15000); // Every 15 seconds for demo
    return () => clearInterval(interval);
  }, [activeToken]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Please Sign In</h2>
          <p className="text-slate-500 mb-6">You need to be logged in to view your live tokens.</p>
          <button onClick={() => navigate('/')} className="m3-button m3-button-gold px-8 py-3">Go to Home</button>
        </div>
      </div>
    );
  }

  if (!activeToken) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-outfit">
        <div className="max-w-2xl mx-auto text-center space-y-6 pt-20">
           <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
             <MapPin size={40} />
           </div>
           <h2 className="text-3xl font-black text-slate-900">No Active Tokens</h2>
           <p className="text-slate-500">You don't have any waiting tokens right now.</p>
           <button onClick={() => navigate('/dashboard')} className="m3-button m3-button-gold px-8 py-4 shadow-gold">
             Book a New Token
           </button>

           {tokens?.length > 0 && (
             <div className="mt-16 text-left">
               <h3 className="font-black text-lg text-slate-900 mb-4">Past Tokens</h3>
               <div className="space-y-4">
                 {tokens.filter(t => t.status !== 'waiting').map(t => (
                   <div key={t.tokenId} className="glass-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex justify-between items-center">
                     <div>
                       <h4 className="font-black text-slate-800">{t.serviceType}</h4>
                       <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                       {t.status}
                     </span>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  const progress = ((total - position) / total) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12 font-outfit overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <Link to="/dashboard" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm">
          <ChevronLeft size={24} className="text-slate-600" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Live Status</h1>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Token: {activeToken.tokenId}</p>
        </div>
        <button 
          onClick={() => setNotifications(!notifications)}
          className={`p-3 rounded-full transition-all border shadow-sm ${notifications ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
        >
          {notifications ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        {activeToken.priorityType === 'emergency' && (
          <div className="bg-rose-100 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-center gap-3 font-black shadow-sm animate-pulse">
            <Sparkles size={20} /> Emergency Priority Active
          </div>
        )}

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
                className={activeToken.priorityType === 'emergency' ? 'text-rose-500' : 'text-primary'}
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
            <p className="text-5xl font-black text-slate-900">#{Math.max(1, 45 - position)}</p>
            <div className="mt-4 inline-block px-3 py-1 bg-secondary/10 rounded-lg text-[10px] text-secondary font-black uppercase tracking-widest">
              Counter 03
            </div>
          </div>
          <div className="glass-white p-8 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center shadow-lg hover:border-primary/20 transition-colors">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <QRCodeSVG 
                value={activeToken.tokenId} 
                size={80} 
                fgColor="#0f172a" 
                bgColor="#ffffff" 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black">Scan at Counter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LiveTracker);
