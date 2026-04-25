import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Phone, Calendar, ArrowRight, Loader2, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileCompletion = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || ''
  });
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [digiLockerLinked, setDigiLockerLinked] = useState(false);

  // If user is not present or already setup, handle appropriately (for safety)
  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><p>Please sign up first.</p></div>;
  }

  const simulateDigiLocker = () => {
    setDigiLockerLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setFormData({
        ...formData,
        name: formData.name || "Aadhaar Verified Name", // Only overwrite if empty or keep it
        age: 62 // Simulate fetching age
      });
      setDigiLockerLinked(true);
      setDigiLockerLoading(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age, 10);
    const isSenior = ageNum >= 60;
    
    updateProfile({
      ...formData,
      age: ageNum,
      isSenior,
      digiLockerLinked
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-outfit p-6 md:p-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 flex-grow flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-white p-8 md:p-12 rounded-[40px] border border-slate-200 shadow-xl"
        >
          <div className="text-center mb-10 space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
               <User size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Complete Profile</h1>
            <p className="text-slate-500 font-medium text-lg">Just a few more details to get you started.</p>
          </div>

          {/* DigiLocker Simulation */}
          <div className="mb-10">
            {!digiLockerLinked ? (
              <button 
                onClick={simulateDigiLocker}
                disabled={digiLockerLoading}
                className="w-full flex items-center justify-center gap-3 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary/50 transition-colors shadow-sm disabled:opacity-70 group"
              >
                {digiLockerLoading ? (
                  <Loader2 className="animate-spin text-primary" size={24} />
                ) : (
                  <ShieldCheck className="text-green-600 group-hover:scale-110 transition-transform" size={24} />
                )}
                <div className="text-left">
                  <h3 className="font-black text-slate-800 text-lg">Link DigiLocker (Recommended)</h3>
                  <p className="text-xs text-slate-500 font-medium">Auto-fetch details & get verified instantly.</p>
                </div>
              </button>
            ) : (
              <div className="w-full flex items-center gap-4 p-6 bg-green-50 border border-green-200 rounded-2xl">
                <div className="p-3 bg-green-100 rounded-full text-green-600"><FileCheck size={24} /></div>
                <div>
                  <h3 className="font-black text-green-800 text-lg">DigiLocker Linked</h3>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-widest">KYC Verified Successfully</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Or enter manually</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="e.g. 35"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full m3-button m3-button-gold py-5 justify-center text-xl mt-8 shadow-gold font-black">
              Save & Continue <ArrowRight size={20} className="ml-2" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
