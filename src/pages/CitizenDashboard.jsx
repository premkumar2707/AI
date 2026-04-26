import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Building, HeartPulse, Bus, Zap, Landmark, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CitizenDashboard = () => {
  const { user, tokens, bookToken } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isUrgent, setIsUrgent] = useState(null);
  
  // AI Triage States
  const [userDescription, setUserDescription] = useState('');
  const [triageResult, setTriageResult] = useState(null);

  if (!user) return <div className="p-10 text-center"><p>Please sign in.</p></div>;

  const activeToken = tokens.find(t => t.status === 'waiting');

  const categories = [
    { id: 'hospital', label: 'Hospital & Health', icon: <HeartPulse className="text-rose-500" /> },
    { id: 'bank', label: 'Banking & Finance', icon: <Landmark className="text-blue-500" /> },
    { id: 'govt', label: 'Govt Services (BBMP)', icon: <Building className="text-primary" /> },
    { id: 'transport', label: 'Transport / Railway', icon: <Bus className="text-emerald-500" /> },
    { id: 'utility', label: 'Utilities & Bills', icon: <Zap className="text-amber-500" /> },
  ];

  const categoryConfigs = {
    hospital: {
      urgencyTitle: "Is this an Emergency?",
      urgentBtn: "Yes, Book Emergency",
      normalBtn: "No, General Checkup",
      inputTitle: "Describe Your Symptoms",
      inputPlaceholder: "e.g., I have been having viral fever for 3 days...",
      urgentType: "Emergency Room",
      normalType: "General Checkup",
      getTriage: (desc) => {
        let p = 'Low Priority', c = 'text-green-600 bg-green-50 border-green-200';
        if (desc.match(/viral|fever|severe|chest|breath|accident/i)) { p = 'High Priority'; c = 'text-rose-600 bg-rose-50 border-rose-200'; }
        else if (desc.match(/pain|vomit|dengue/i)) { p = 'Medium Priority'; c = 'text-amber-600 bg-amber-50 border-amber-200'; }
        return { p, c, centers: [
          { name: 'Victoria Hospital', crowd: 'Full Crowded', color: 'bg-rose-100 text-rose-700 border-rose-200', wait: '2 hrs' },
          { name: 'Bowring Hospital', crowd: 'Mid-Range Crowd', color: 'bg-amber-100 text-amber-700 border-amber-200', wait: '45 mins' },
          { name: 'KC General Hospital', crowd: 'Low Crowd / Free', color: 'bg-green-100 text-green-700 border-green-200', wait: '10 mins', recommended: true }
        ]};
      }
    },
    bank: {
      urgencyTitle: "Is this a High-Value / Urgent Transaction?",
      urgentBtn: "Yes, Urgent/High-Value",
      normalBtn: "No, Regular Services",
      inputTitle: "Describe Your Banking Need",
      inputPlaceholder: "e.g., Cash deposit of over 1 Lakh, DD creation, or Fraud...",
      urgentType: "Priority Banking",
      normalType: "Regular Banking",
      getTriage: (desc) => {
        let p = 'Low Priority', c = 'text-green-600 bg-green-50 border-green-200';
        if (desc.match(/lakh|urgent|dd|demand draft|fraud|stolen/i)) { p = 'High Priority'; c = 'text-rose-600 bg-rose-50 border-rose-200'; }
        else if (desc.match(/cheque|loan|account/i)) { p = 'Medium Priority'; c = 'text-amber-600 bg-amber-50 border-amber-200'; }
        return { p, c, centers: [
          { name: 'SBI Main Branch', crowd: 'Full Crowded', color: 'bg-rose-100 text-rose-700 border-rose-200', wait: '1.5 hrs' },
          { name: 'Canara Bank', crowd: 'Mid-Range Crowd', color: 'bg-amber-100 text-amber-700 border-amber-200', wait: '35 mins' },
          { name: 'HDFC Branch', crowd: 'Low Crowd / Free', color: 'bg-green-100 text-green-700 border-green-200', wait: '5 mins', recommended: true }
        ]};
      }
    },
    govt: {
      urgencyTitle: "Is there a statutory deadline today?",
      urgentBtn: "Yes, Urgent Deadline",
      normalBtn: "No, Regular Application",
      inputTitle: "Describe Your Govt Service Need",
      inputPlaceholder: "e.g., Trade license renewal, property tax payment...",
      urgentType: "Fast-Track Services",
      normalType: "General Services",
      getTriage: (desc) => {
        let p = 'Low Priority', c = 'text-green-600 bg-green-50 border-green-200';
        if (desc.match(/tax|deadline|fine|trade|today/i)) { p = 'High Priority'; c = 'text-rose-600 bg-rose-50 border-rose-200'; }
        else if (desc.match(/certificate|aadhar|passport/i)) { p = 'Medium Priority'; c = 'text-amber-600 bg-amber-50 border-amber-200'; }
        return { p, c, centers: [
          { name: 'Cauvery Bhavan', crowd: 'Full Crowded', color: 'bg-rose-100 text-rose-700 border-rose-200', wait: '2.5 hrs' },
          { name: 'Malleshwaram BDA', crowd: 'Mid-Range Crowd', color: 'bg-amber-100 text-amber-700 border-amber-200', wait: '50 mins' },
          { name: 'Bangalore One Center', crowd: 'Low Crowd / Free', color: 'bg-green-100 text-green-700 border-green-200', wait: '12 mins', recommended: true }
        ]};
      }
    },
    transport: {
      urgencyTitle: "Is this for Immediate Departure?",
      urgentBtn: "Yes, Tatkal/Immediate",
      normalBtn: "No, Advance Booking",
      inputTitle: "Describe Your Journey",
      inputPlaceholder: "e.g., Tatkal ticket to Mumbai for tonight...",
      urgentType: "Tatkal / Immediate",
      normalType: "Advance Booking",
      getTriage: (desc) => {
        let p = 'Low Priority', c = 'text-green-600 bg-green-50 border-green-200';
        if (desc.match(/tatkal|tonight|immediate|emergency|now/i)) { p = 'High Priority'; c = 'text-rose-600 bg-rose-50 border-rose-200'; }
        else if (desc.match(/cancel|refund/i)) { p = 'Medium Priority'; c = 'text-amber-600 bg-amber-50 border-amber-200'; }
        return { p, c, centers: [
          { name: 'Majestic KSR Station', crowd: 'Full Crowded', color: 'bg-rose-100 text-rose-700 border-rose-200', wait: '1 hr' },
          { name: 'Yeshwanthpur Junction', crowd: 'Mid-Range Crowd', color: 'bg-amber-100 text-amber-700 border-amber-200', wait: '30 mins' },
          { name: 'Cantonment Station', crowd: 'Low Crowd / Free', color: 'bg-green-100 text-green-700 border-green-200', wait: '5 mins', recommended: true }
        ]};
      }
    },
    utility: {
      urgencyTitle: "Is there a service outage or hazard?",
      urgentBtn: "Yes, Power/Water Cut",
      normalBtn: "No, Regular Bill Payment",
      inputTitle: "Describe Your Utility Issue",
      inputPlaceholder: "e.g., Power cut since 3 hours, water line leakage, sparking...",
      urgentType: "Outage Reporting",
      normalType: "Bill Payment & General",
      getTriage: (desc) => {
        let p = 'Low Priority', c = 'text-green-600 bg-green-50 border-green-200';
        if (desc.match(/cut|outage|leak|spark|danger|fire|no water/i)) { p = 'High Priority'; c = 'text-rose-600 bg-rose-50 border-rose-200'; }
        else if (desc.match(/new connection|meter|fault/i)) { p = 'Medium Priority'; c = 'text-amber-600 bg-amber-50 border-amber-200'; }
        return { p, c, centers: [
          { name: 'BESCOM Main Office', crowd: 'Full Crowded', color: 'bg-rose-100 text-rose-700 border-rose-200', wait: '45 mins' },
          { name: 'BWSSB Central', crowd: 'Mid-Range Crowd', color: 'bg-amber-100 text-amber-700 border-amber-200', wait: '20 mins' },
          { name: 'Local AEE Office', crowd: 'Low Crowd / Free', color: 'bg-green-100 text-green-700 border-green-200', wait: '2 mins', recommended: true }
        ]};
      }
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setIsUrgent(null); 
    setUserDescription('');
    setTriageResult(null);
  };

  const config = selectedCategory ? categoryConfigs[selectedCategory] : null;

  const handleBookUrgent = () => {
    bookToken({
      serviceType: config.urgentType,
      centerId: 'Nearest Available Center',
      priorityType: 'emergency',
      bookingSource: 'app',
      estimatedWait: 0
    });
    navigate('/live-status');
  };

  const handleAnalyze = () => {
    if(!userDescription.trim()) return alert("Please provide a description.");
    const triage = config.getTriage(userDescription);
    setTriageResult({
      description: userDescription,
      priority: triage.p,
      priorityColor: triage.c,
      hospitals: triage.centers // We'll keep the variable name hospitals for centers to minimize code change
    });
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
          <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">Select Service Sector</h3>
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
          {selectedCategory !== null && config && (
            <motion.div key="generic-flow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4 mt-4">
               {/* KYC Verification Card */}
               <div className="bg-blue-50 border border-blue-200 p-6 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm"><User /></div>
                    <div>
                      <h4 className="font-black text-slate-900">{user.name}</h4>
                      <p className="text-sm font-medium text-slate-600">{user.phone || 'Phone not provided'}</p>
                    </div>
                 </div>
                 <div className="px-4 py-2 bg-white rounded-xl border border-blue-200 text-blue-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm">
                   <ShieldCheck size={16} /> KYC Verified Citizen
                 </div>
               </div>

               {isUrgent === null && (
                  <div className="bg-rose-50 border border-rose-200 p-8 rounded-[32px] shadow-sm">
                    <h3 className="text-2xl font-black text-rose-800 mb-6 flex items-center gap-2">
                      <AlertTriangle /> {config.urgencyTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={handleBookUrgent} className="flex-1 bg-rose-600 text-white p-6 rounded-2xl font-black text-lg shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle size={20} /> {config.urgentBtn}
                      </button>
                      <button onClick={() => setIsUrgent(false)} className="flex-1 bg-white border border-rose-200 text-rose-700 p-6 rounded-2xl font-bold text-lg hover:bg-rose-100 transition-colors">
                        {config.normalBtn}
                      </button>
                    </div>
                  </div>
               )}

               {isUrgent === false && !triageResult && (
                  <div className="glass-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{config.inputTitle}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">QueueSmart AI will analyze your request to determine queue priority and find the best center with low crowding.</p>
                    <textarea 
                      value={userDescription}
                      onChange={e => setUserDescription(e.target.value)}
                      placeholder={config.inputPlaceholder}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-6 min-h-[120px] outline-none focus:border-primary font-medium text-slate-700 mb-6 shadow-inner text-lg"
                    />
                    <button onClick={handleAnalyze} className="w-full m3-button m3-button-gold py-5 justify-center shadow-gold font-black text-lg">
                      <Sparkles className="mr-2" size={20} /> Analyze & Find Centers
                    </button>
                  </div>
               )}

               {isUrgent === false && triageResult && (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-[24px] border shadow-sm ${triageResult.priorityColor}`}>
                      <h4 className="font-black text-lg mb-1 flex items-center gap-2"><Sparkles size={18} /> AI Triage Complete</h4>
                      <p className="text-sm font-medium opacity-80 mb-3">Based on your input: "{triageResult.description}"</p>
                      <div className="inline-block px-3 py-1 bg-white/50 backdrop-blur-sm rounded-lg font-black text-xs uppercase tracking-widest border border-white/20 shadow-sm">
                        Calculated Priority: {triageResult.priority}
                      </div>
                    </div>

                    <div className="glass-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-black text-slate-900 mb-4">Center Crowd Analysis</h3>
                      <div className="space-y-4">
                        {triageResult.hospitals.map((center, i) => (
                          <div key={i} className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${center.recommended ? 'bg-primary/5 border-primary/30 shadow-md relative overflow-hidden' : 'bg-white border-slate-100 shadow-sm'}`}>
                            {center.recommended && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-black text-slate-900 text-lg">{center.name}</h4>
                                 {center.recommended && <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest shadow-sm">Best Route</span>}
                               </div>
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Est Wait: {center.wait}</p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                               <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${center.color}`}>
                                 {center.crowd}
                               </div>
                               <button 
                                 onClick={() => {
                                   bookToken({ serviceType: config.normalType, centerId: center.name, priorityType: triageResult.priority.toLowerCase(), bookingSource: 'app', estimatedWait: 15 });
                                   navigate('/live-status');
                                 }}
                                 className="ml-auto md:ml-0 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black shadow-md hover:scale-105 transition-transform"
                               >
                                 Book Route
                               </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CitizenDashboard;
