import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Building, HeartPulse, Bus, Zap, Landmark, AlertTriangle, ArrowRight, FileText, CheckCircle2, Navigation, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CitizenDashboard = () => {
  const { user, tokens, bookToken } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEmergency, setIsEmergency] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Fallback for safety
  if (!user) {
    return <div className="p-10 text-center"><p>Please sign in.</p></div>;
  }

  const activeToken = tokens.find(t => t.status === 'waiting');

  const categories = [
    { id: 'hospital', label: 'Hospital & Health', icon: <HeartPulse className="text-rose-500" /> },
    { id: 'bank', label: 'Banking & Finance', icon: <Landmark className="text-blue-500" /> },
    { id: 'govt', label: 'Govt Services (BBMP)', icon: <Building className="text-primary" /> },
    { id: 'transport', label: 'Transport / Railway', icon: <Bus className="text-emerald-500" /> },
    { id: 'utility', label: 'Utilities & Bills', icon: <Zap className="text-amber-500" /> },
  ];

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowRecommendation(false);
    setIsEmergency(null); // Reset emergency state on new category select
  };

  const handleBookEmergency = () => {
    bookToken({
      serviceType: 'Emergency Room',
      centerId: 'HOSP-01',
      priorityType: 'emergency',
      bookingSource: 'app',
      estimatedWait: 0
    });
    navigate('/live-status');
  };

  const handleSmartRouting = () => {
    // Simulate AI Smart Routing delay
    setTimeout(() => {
      setShowRecommendation(true);
    }, 1000);
  };

  const handleBookNormal = () => {
    bookToken({
      serviceType: selectedCategory === 'bank' ? 'Account Services' : 'General Service',
      centerId: 'REC-01',
      priorityType: user.isSenior ? 'senior' : 'normal',
      bookingSource: 'app',
      estimatedWait: user.isSenior ? 15 : 45
    });
    navigate('/live-status');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit p-6 md:p-10 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Section */}
        <div className="glass-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
           <div className="flex items-center gap-6 z-10 w-full md:w-auto">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
               <User size={32} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
               <p className="text-sm text-slate-500 font-medium mb-2">{user.phone} • {user.age} Years Old</p>
               <div className="flex flex-wrap gap-2">
                 {user.isSenior ? (
                   <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-200 shadow-sm">
                     🟡 Senior Citizen Priority
                   </span>
                 ) : (
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200 shadow-sm">
                     🟢 Normal Priority
                   </span>
                 )}
                 {user.digiLockerLinked && (
                   <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 border border-green-200 shadow-sm">
                     <ShieldCheck size={12} /> DigiLocker Verified
                   </span>
                 )}
               </div>
             </div>
           </div>
           
           <div className="z-10 w-full md:w-auto">
              <button onClick={() => navigate('/profile-setup')} className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:border-primary transition-colors shadow-sm">
                Edit Profile
              </button>
           </div>
        </div>

        {/* Live Token Status Alert */}
        {activeToken && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary text-white p-6 rounded-[24px] shadow-gold flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
               <h3 className="font-black text-xl flex items-center gap-2"><CheckCircle2 /> Active Token</h3>
               <p className="text-white/80 font-medium">You have a waiting token for {activeToken.serviceType}.</p>
             </div>
             <button onClick={() => navigate('/live-status')} className="px-6 py-3 bg-white text-primary rounded-xl font-black shadow-sm hover:scale-105 transition-transform w-full md:w-auto text-center">
               View Live Tracking
             </button>
          </motion.div>
        )}

        {/* Service Categories Grid */}
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">Select Service</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-6 rounded-[24px] flex flex-col items-center gap-4 transition-all border ${selectedCategory === cat.id ? 'bg-white border-primary shadow-lg scale-105' : 'glass-white border-slate-200 hover:border-primary/50 shadow-sm'}`}
              >
                <div className={`p-3 rounded-full ${selectedCategory === cat.id ? 'bg-primary/10' : 'bg-slate-50'}`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-black text-slate-700 text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic UI based on selection */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'hospital' && isEmergency === null && (
            <motion.div key="hospital-prompt" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-rose-50 border border-rose-200 p-8 rounded-[32px] shadow-sm mt-4">
                <h3 className="text-2xl font-black text-rose-800 mb-6 flex items-center gap-2">
                  <AlertTriangle /> Is this an Emergency?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleBookEmergency} className="flex-1 bg-rose-600 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <HeartPulse /> Yes, Book Emergency
                  </button>
                  <button onClick={() => setIsEmergency(false)} className="flex-1 bg-white border border-rose-200 text-rose-700 p-6 rounded-2xl font-bold text-lg hover:bg-rose-100 transition-colors">
                    No, General Checkup
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {selectedCategory !== null && (selectedCategory !== 'hospital' || isEmergency === false) && (
            <motion.div key="routing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-white p-8 rounded-[32px] border border-slate-200 shadow-md mt-4">
               <h3 className="text-xl font-black text-slate-900 mb-6">AI Smart Routing</h3>
               
               {!showRecommendation ? (
                 <div className="space-y-6">
                   <p className="text-slate-500 font-medium">We will analyze nearby centers for <strong>{categories.find(c=>c.id===selectedCategory)?.label}</strong> based on live queue length and travel distance.</p>
                   <button onClick={handleSmartRouting} className="w-full m3-button m3-button-gold py-5 justify-center shadow-gold font-black text-lg">
                     <Sparkles className="mr-2" size={20} /> Find Fastest Center
                   </button>
                 </div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-[24px]">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <span className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-1 mb-1">
                             <CheckCircle2 size={12} /> Recommended Center (Lowest Wait)
                           </span>
                           <h4 className="text-2xl font-black text-slate-900">Cauvery Bhavan Center</h4>
                         </div>
                         <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-green-200">
                           Low Crowd
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4 mt-6 border-t border-primary/10 pt-6">
                         <div>
                           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Est. Wait</p>
                           <p className="text-xl font-black text-slate-800">12 mins</p>
                         </div>
                         <div>
                           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Travel</p>
                           <p className="text-xl font-black text-slate-800">8 mins</p>
                         </div>
                         <div>
                           <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Distance</p>
                           <p className="text-xl font-black text-slate-800">2.4 km</p>
                         </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 flex items-start gap-4">
                      <FileText className="text-secondary shrink-0" />
                      <div>
                        <p className="text-sm font-black text-slate-800 mb-1">Required Documents</p>
                        <p className="text-xs font-medium text-slate-500">Please carry your Original Aadhaar and one address proof.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={handleBookNormal} className="flex-1 m3-button m3-button-gold py-5 justify-center shadow-gold font-black text-lg">
                        Book Token Now
                      </button>
                      <button className="px-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:text-primary hover:border-primary transition-colors flex items-center justify-center">
                        <Navigation size={24} />
                      </button>
                    </div>
                 </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CitizenDashboard;
