import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Phone, Calendar, ArrowRight, Loader2, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileCompletion = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || ''
  });
  
  // KYC Flow State
  // 0: idle, 1: enter aadhaar, 2: enter otp, 3: loading, 4: verified
  const [kycStep, setKycStep] = useState(0);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [twilioError, setTwilioError] = useState(null);

  // If user is not present or already setup, handle appropriately (for safety)
  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><p>Please sign up first.</p></div>;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (aadhaar.length === 12 && formData.phone) {
      setIsSendingOtp(true);
      setTwilioError(null);
      
      // Generate a truly random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOtp(generatedOtp);

      try {
        // Call the local backend server that integrates with Twilio
        const response = await fetch('http://localhost:3001/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: formData.phone, otp: generatedOtp })
        });
        const data = await response.json();
        
        if (data.error) {
          setTwilioError(data.error);
        } else {
          console.log('Twilio response:', data);
          setKycStep(2); // Move to OTP entry step only if it didn't throw a fatal network error
        }
      } catch (error) {
        console.error('Failed to call Twilio backend:', error);
        setTwilioError("Failed to reach the backend server. Is it running?");
      }
      
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === expectedOtp) {
      setTwilioError(null);
      setKycStep(3); // Loading
      // Simulate API delay for verifying documents
      setTimeout(() => {
        setFormData({
          ...formData,
          name: "Aadhaar Verified Citizen", // Simulated verified name
          age: 65 // Simulated fetching age (will trigger Senior Citizen)
        });
        setKycStep(4); // Verified
      }, 2000);
    } else {
      setTwilioError("Invalid OTP entered. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age, 10);
    const isSenior = ageNum >= 60;
    
    updateProfile({
      ...formData,
      age: ageNum,
      isSenior,
      digiLockerLinked: kycStep === 4
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

          {/* DigiLocker KYC Flow */}
          <div className="mb-10">
            <AnimatePresence mode="wait">
              {kycStep === 0 && (
                <motion.button 
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setKycStep(1)}
                  className="w-full flex items-center justify-center gap-3 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary/50 transition-colors shadow-sm group"
                >
                  <ShieldCheck className="text-green-600 group-hover:scale-110 transition-transform" size={24} />
                  <div className="text-left">
                    <h3 className="font-black text-slate-800 text-lg">Link DigiLocker / KYC</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify Aadhaar via Twilio SMS OTP.</p>
                  </div>
                </motion.button>
              )}

              {kycStep === 1 && (
                <motion.form 
                  key="aadhaar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSendOtp}
                  className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 relative"
                >
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Enter 12-Digit Aadhaar</label>
                    <input 
                      type="text" 
                      maxLength="12"
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary font-bold text-slate-700 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Your Phone Number (For Twilio OTP)</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+919876543210"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary font-bold text-slate-700 mt-1"
                    />
                  </div>
                  
                  {twilioError && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-rose-200">
                      <AlertTriangle size={14} className="shrink-0" /> {twilioError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setKycStep(0)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                    <button type="submit" disabled={aadhaar.length !== 12 || !formData.phone || isSendingOtp} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      {isSendingOtp ? <Loader2 size={18} className="animate-spin" /> : "Send Twilio OTP"}
                    </button>
                  </div>
                </motion.form>
              )}

              {kycStep === 2 && (
                <motion.form 
                  key="otp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleVerifyOtp}
                  className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative"
                >
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Enter OTP sent via Twilio to {formData.phone}</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXXXX"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-primary font-bold tracking-[0.5em] text-center text-slate-700 mt-1"
                    />
                  </div>

                  {twilioError && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-rose-200">
                      <AlertTriangle size={14} /> {twilioError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setKycStep(1)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">Back</button>
                    <button type="submit" disabled={otp.length !== 6} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50">Verify Real OTP</button>
                  </div>
                </motion.form>
              )}

              {kycStep === 3 && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-sm font-bold text-slate-600">Verifying Twilio OTP & Fetching Aadhaar...</p>
                </motion.div>
              )}

              {kycStep === 4 && (
                <motion.div 
                  key="verified"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex items-center gap-4 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm"
                >
                  <div className="p-3 bg-green-500 rounded-full text-white shadow-md shadow-green-200"><CheckCircle2 size={24} /></div>
                  <div>
                    <h3 className="font-black text-green-800 text-lg">KYC Verified via Twilio</h3>
                    <p className="text-xs text-green-700 font-bold uppercase tracking-widest mt-1">DigiLocker Linked • Aadhaar Fetched</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Profile Details</span>
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
                  readOnly={kycStep === 4}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone number is now strictly asked in the KYC box if it is empty, but we keep it here for users who don't want to do KYC */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+919876543210"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 shadow-sm"
                    readOnly={kycStep === 4}
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
                    readOnly={kycStep === 4}
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
