import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Users, Accessibility, HelpCircle, CheckCircle2, ArrowLeft, Star } from 'lucide-react';

const KioskMode = memo(() => {
  const [step, setStep] = useState('language'); // language, service, confirm, success
  const [language, setLanguage] = useState('en');
  const [isPriority, setIsPriority] = useState(false);

  const services = [
    { id: 'aadhaar', label: { en: 'Aadhaar Services', kn: 'ಆಧಾರ್ ಸೇವೆಗಳು' }, icon: <Ticket className="w-10 h-10 md:w-16 md:h-16" /> },
    { id: 'pension', label: { en: 'Pension Inquiry', kn: 'ಪಿಂಚಣಿ ವಿಚಾರಣೆ' }, icon: <Users className="w-10 h-10 md:w-16 md:h-16" /> },
    { id: 'utility', label: { en: 'Bill Payment', kn: 'ಬಿಲ್ ಪಾವತಿ' }, icon: <Ticket className="w-10 h-10 md:w-16 md:h-16" /> },
    { id: 'other', label: { en: 'Other Help', kn: 'ಇತರ ಸಹಾಯ' }, icon: <HelpCircle className="w-10 h-10 md:w-16 md:h-16" /> },
  ];

  return (
    <div className="fixed inset-0 bg-white text-slate-800 font-outfit overflow-hidden select-none">
      {/* Kiosk Background Decorations - Optimized Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -ml-40 -mb-40" />
      </div>

      {/* Kiosk Header */}
      <div className="absolute top-0 w-full p-6 md:p-12 flex justify-between items-center bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-gold">
             <Ticket className="text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900">
            Queue<span className="text-primary">Smart</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <p className="text-[10px] md:text-sm text-slate-400 font-black uppercase tracking-widest">Cauvery Bhavan One</p>
             <p className="text-sm md:text-xl font-black text-secondary">25 April, 2026</p>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'language' && (
          <motion.div 
            key="lang"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-20 overflow-y-auto"
          >
            <div className="max-w-5xl w-full flex flex-col items-center gap-10 md:gap-16">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight">
                  Welcome to QueueSmart
                </h2>
                <span className="text-2xl md:text-5xl font-black text-primary block">ಸ್ವಾಗತ</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
                <KioskButton 
                  label="English" 
                  sub="Continue in English" 
                  color="border-secondary hover:bg-secondary/5"
                  iconColor="text-secondary"
                  onClick={() => { setLanguage('en'); setStep('service'); }} 
                />
                <KioskButton 
                  label="ಕನ್ನಡ" 
                  sub="ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ" 
                  color="border-primary hover:bg-primary/5"
                  iconColor="text-primary"
                  onClick={() => { setLanguage('kn'); setStep('service'); }} 
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 'service' && (
          <motion.div 
            key="service"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full flex flex-col items-center p-6 md:p-20 pt-24 md:pt-48 overflow-y-auto"
          >
            <div className="max-w-6xl w-full flex flex-col items-center">
              <div className="mb-10 md:mb-16 text-center">
                <h2 className="text-3xl md:text-6xl font-black mb-4 text-slate-900">
                  {language === 'en' ? 'Select Service' : 'ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ'}
                </h2>
                <p className="text-lg md:text-2xl text-slate-500 font-medium">
                  {language === 'en' ? 'Tap the service you need today' : 'ನಿಮಗೆ ಬೇಕಾದ ಸೇವೆಯನ್ನು ಒತ್ತಿರಿ'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full">
                {services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setStep('confirm')}
                    className="glass-white border-2 border-slate-100 hover:border-primary p-8 md:p-16 rounded-[40px] flex flex-col items-center gap-6 md:gap-10 transition-all active:scale-95 shadow-lg hover:shadow-gold/10"
                  >
                    <div className="text-primary">{s.icon}</div>
                    <span className="text-2xl md:text-4xl font-black text-slate-800">{s.label[language]}</span>
                  </button>
                ))}
              </div>

              {/* Priority Section */}
              <div className="mt-12 md:mt-20 w-full max-w-4xl">
                <button 
                  onClick={() => setIsPriority(!isPriority)}
                  className={`w-full p-8 md:p-12 rounded-[40px] border-4 flex items-center justify-center gap-6 md:gap-10 transition-all ${isPriority ? 'bg-amber-100 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  <Accessibility className="w-10 h-10 md:w-14 md:h-14" />
                  <span className="text-2xl md:text-4xl font-black uppercase tracking-widest">
                    {language === 'en' ? 'Priority Access' : 'ಆದ್ಯತೆಯ ಪ್ರವೇಶ'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-20 overflow-y-auto"
          >
             <div className="glass-white p-10 md:p-20 rounded-[60px] border-4 border-primary/20 max-w-4xl w-full text-center space-y-12 md:space-y-20 shadow-2xl">
                <div className="space-y-4">
                  <h3 className="text-5xl md:text-9xl font-black text-slate-900">Ready?</h3>
                  <p className="text-2xl md:text-4xl text-slate-500 font-medium">Your token is being prepared</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 md:gap-10">
                  <button onClick={() => setStep('service')} className="flex-1 py-6 md:py-10 rounded-[32px] bg-slate-50 text-2xl md:text-4xl font-black text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-sm transition-colors">Back</button>
                  <button onClick={() => setStep('success')} className="flex-1 py-6 md:py-10 rounded-[32px] bg-primary text-white text-3xl md:text-5xl font-black shadow-gold hover:scale-105 transition-transform">Generate</button>
                </div>
             </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-20 text-center gap-8 md:gap-16 overflow-y-auto"
          >
             <div className="w-40 h-40 md:w-64 md:h-64 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
               <CheckCircle2 className="w-24 h-24 md:w-40 md:h-40 text-white" />
             </div>
             <div className="space-y-4">
               <h2 className="text-5xl md:text-8xl font-black text-slate-900">Token Generated!</h2>
               <p className="text-2xl md:text-5xl text-slate-500 font-medium italic">Please collect your slip</p>
             </div>
             <div className="glass-white p-10 md:p-20 rounded-[60px] border-4 border-primary shadow-2xl">
               <div className="flex items-center justify-center gap-4 mb-4">
                 <Star className="text-primary fill-primary" />
                 <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-primary">Priority Token</span>
                 <Star className="text-primary fill-primary" />
               </div>
               <p className="text-8xl md:text-[180px] font-black tracking-tighter text-slate-900 leading-none">B-42</p>
               <p className="text-2xl md:text-5xl text-secondary font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mt-8">Wait: ~12 mins</p>
             </div>
             <button 
               onClick={() => { setStep('language'); setIsPriority(false); }}
               className="mt-6 md:mt-12 text-2xl md:text-4xl font-black text-slate-400 hover:text-primary flex items-center gap-6 transition-colors"
             >
               <ArrowLeft size={48} /> Start Over
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const KioskButton = memo(({ label, sub, onClick, color, iconColor }) => (
  <button 
    onClick={onClick}
    className={`bg-white border-4 ${color} p-12 md:p-20 rounded-[60px] flex flex-col items-center gap-4 transition-all shadow-xl hover:shadow-2xl active:scale-95 group`}
  >
    <span className={`text-6xl md:text-9xl font-black ${iconColor} transition-colors`}>{label}</span>
    <span className="text-xl md:text-4xl text-slate-500 font-bold tracking-tight">{sub}</span>
  </button>
));

export default KioskMode;
