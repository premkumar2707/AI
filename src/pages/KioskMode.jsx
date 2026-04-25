import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Users, Accessibility, HelpCircle, CheckCircle2, ArrowLeft, Star, Globe, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const translations = {
  selectService: { en: 'Select Service', kn: 'ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', hi: 'सेवा चुनें', ml: 'സേവനം തിരഞ്ഞെടുക്കുക', te: 'సేవను ఎంచుకోండి' },
  tapService: { en: 'Tap the service you need today', kn: 'ನಿಮಗೆ ಬೇಕಾದ ಸೇವೆಯನ್ನು ಒತ್ತಿರಿ', hi: 'आज आपको जो सेवा चाहिए उस पर टैप करें', ml: 'ഇന്ന് നിങ്ങൾക്ക് വേണ്ട സേവനം ടാപ്പുചെയ്യുക', te: 'ఈరోజు మీకు కావాల్సిన సేవను నొక్కండి' },
  priorityAccess: { en: 'Priority Access', kn: 'ಆದ್ಯತೆಯ ಪ್ರವೇಶ', hi: 'प्राथमिकता पहुंच', ml: 'മുൻഗണനാ ആക്സസ്', te: 'ప్రాధాన్యత ప్రాప్యత' },
  ready: { en: 'Ready?', kn: 'ಸಿದ್ಧವಿದ್ದೀರಾ?', hi: 'तैयार हैं?', ml: 'തയ്യാറാണോ?', te: 'సిద్ధంగా ఉన్నారా?' },
  preparing: { en: 'Your token is being prepared', kn: 'ನಿಮ್ಮ ಟೋಕನ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ', hi: 'आपका टोकन तैयार किया जा रहा है', ml: 'നിങ്ങളുടെ ടോക്കൺ തയ്യാറാക്കുന്നു', te: 'మీ టోకెన్ సిద్ధమవుతోంది' },
  back: { en: 'Back', kn: 'ಹಿಂದೆ', hi: 'वापस', ml: 'മടങ്ങുക', te: 'వెనుకకు' },
  generate: { en: 'Generate', kn: 'ರಚಿಸಿ', hi: 'बनाएं', ml: 'സൃഷ്ടിക്കുക', te: 'ఉత్పత్తి చేయండి' },
  tokenGenerated: { en: 'Token Generated!', kn: 'ಟೋಕನ್ ರಚಿಸಲಾಗಿದೆ!', hi: 'टोकन बन गया!', ml: 'ടോക്കൺ സൃഷ്ടിച്ചു!', te: 'టోకెన్ రూపొందించబడింది!' },
  collectSlip: { en: 'Please collect your slip', kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಚೀಟಿಯನ್ನು ಸಂಗ್ರಹಿಸಿ', hi: 'कृपया अपनी पर्ची लें', ml: 'ദയവായി നിങ്ങളുടെ സ്ലിപ്പ് ശേഖരിക്കുക', te: 'దయచేసి మీ స్లిప్ తీసుకోండి' },
  priorityToken: { en: 'Priority Token', kn: 'ಆದ್ಯತೆಯ ಟೋಕನ್', hi: 'प्राथमिकता टोकन', ml: 'മുൻഗണനാ ടോക്കൺ', te: 'ప్రాధాన్యత టోకెన్' },
  wait: { en: 'Wait', kn: 'ನಿರೀಕ್ಷಿಸಿ', hi: 'प्रतीक्षा करें', ml: 'കാത്തിരിക്കുക', te: 'వేచి ఉండండి' },
  startOver: { en: 'Start Over', kn: 'ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ', hi: 'फिर से शुरू करें', ml: 'വീണ്ടും തുടങ്ങുക', te: 'మళ్లీ ప్రారంభించండి' }
};

const KioskMode = memo(() => {
  const [step, setStep] = useState('service'); // service, confirm, success
  const [language, setLanguage] = useState('en');
  const [isPriority, setIsPriority] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const services = [
    { id: 'aadhaar', label: { en: 'Aadhaar Services', kn: 'ಆಧಾರ್ ಸೇವೆಗಳು', hi: 'आधार सेवाएं', ml: 'ആധാർ സേവനങ്ങൾ', te: 'ఆధార్ సేవలు' }, icon: <Ticket className="w-8 h-8 md:w-12 md:h-12" /> },
    { id: 'pension', label: { en: 'Pension Inquiry', kn: 'ಪಿಂಚಣಿ ವಿಚಾರಣೆ', hi: 'पेंशन पूछताछ', ml: 'പെൻഷൻ അന്വേഷണം', te: 'పింఛను విచారణ' }, icon: <Users className="w-8 h-8 md:w-12 md:h-12" /> },
    { id: 'utility', label: { en: 'Bill Payment', kn: 'ಬಿಲ್ ಪಾವತಿ', hi: 'बिल भुगतान', ml: 'ബിൽ പേയ്മെന്റ്', te: 'బిల్లు చెల్లింపు' }, icon: <Ticket className="w-8 h-8 md:w-12 md:h-12" /> },
    { id: 'other', label: { en: 'Other Help', kn: 'ಇತರ ಸಹಾಯ', hi: 'अन्य मदद', ml: 'മറ്റ് സഹായം', te: 'ఇతర సహాయం' }, icon: <HelpCircle className="w-8 h-8 md:w-12 md:h-12" /> },
  ];

  const langs = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ml', name: 'മലയാളം' }
  ];

  const t = (key) => translations[key][language];

  return (
    <div className="fixed inset-0 bg-white text-slate-800 font-outfit overflow-hidden select-none">
      {/* Kiosk Background Decorations - Optimized Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -ml-40 -mb-40" />
      </div>

      {/* Kiosk Header */}
      <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-gold hover:scale-105 transition-transform">
             <Ticket className="text-white" size={20} />
          </Link>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter text-slate-900">
            Queue<span className="text-primary">Smart</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
             <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest">Cauvery Bhavan One</p>
             <p className="text-xs md:text-base font-black text-secondary">25 April, 2026</p>
           </div>
           {/* Language Selector Button */}
           <button 
             onClick={() => setShowLangMenu(true)}
             className="flex items-center gap-2 p-3 md:px-5 md:py-2 bg-slate-100 hover:bg-primary/10 hover:text-primary transition-colors rounded-xl text-slate-600 font-black"
           >
             <Globe size={20} />
             <span className="hidden md:block uppercase tracking-widest text-sm">{langs.find(l => l.code === language).name}</span>
           </button>
        </div>
      </div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLangMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLangMenu(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass-white rounded-[32px] p-8 md:p-10 max-w-2xl w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                  <Globe className="text-primary" size={28} /> Select Language
                </h2>
                <button onClick={() => setShowLangMenu(false)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {langs.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                    className={`p-6 rounded-2xl text-lg md:text-xl font-black transition-all ${language === l.code ? 'bg-primary text-white shadow-gold scale-105' : 'bg-slate-50 text-slate-600 hover:bg-primary/10 hover:text-primary border border-slate-200 shadow-sm'}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'service' && (
          <motion.div 
            key="service"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full flex flex-col items-center p-6 md:p-10 pt-28 md:pt-36 overflow-y-auto"
          >
            <div className="max-w-5xl w-full flex flex-col items-center">
              <div className="mb-8 md:mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-3 text-slate-900">
                  {t('selectService')}
                </h2>
                <p className="text-lg md:text-xl text-slate-500 font-medium">
                  {t('tapService')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                {services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setStep('confirm')}
                    className="glass-white border-2 border-slate-100 hover:border-primary p-6 md:p-10 rounded-[32px] flex flex-col items-center gap-4 transition-all active:scale-95 shadow-lg hover:shadow-gold/10"
                  >
                    <div className="text-primary">{s.icon}</div>
                    <span className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug">{s.label[language]}</span>
                  </button>
                ))}
              </div>

              {/* Priority Section */}
              <div className="mt-8 md:mt-12 w-full max-w-2xl">
                <button 
                  onClick={() => setIsPriority(!isPriority)}
                  className={`w-full p-6 md:p-8 rounded-[32px] border-4 flex items-center justify-center gap-4 md:gap-6 transition-all ${isPriority ? 'bg-amber-100 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  <Accessibility className="w-8 h-8 md:w-10 md:h-10" />
                  <span className="text-xl md:text-2xl font-black uppercase tracking-widest">
                    {t('priorityAccess')}
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
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-10 pt-28 md:pt-36 overflow-y-auto"
          >
             <div className="glass-white p-8 md:p-16 rounded-[48px] border-4 border-primary/20 max-w-2xl w-full text-center space-y-8 md:space-y-12 shadow-2xl">
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black text-slate-900">{t('ready')}</h3>
                  <p className="text-xl md:text-2xl text-slate-500 font-medium">{t('preparing')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <button onClick={() => setStep('service')} className="flex-1 py-4 md:py-6 rounded-2xl bg-slate-50 text-xl md:text-2xl font-black text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-sm transition-colors">{t('back')}</button>
                  <button onClick={() => setStep('success')} className="flex-1 py-4 md:py-6 rounded-2xl bg-primary text-white text-xl md:text-2xl font-black shadow-gold hover:scale-105 transition-transform">{t('generate')}</button>
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
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center gap-6 md:gap-10 pt-28 md:pt-36 overflow-y-auto"
          >
             <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
               <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
             </div>
             <div className="space-y-2">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900">{t('tokenGenerated')}</h2>
               <p className="text-xl md:text-2xl text-slate-500 font-medium italic">{t('collectSlip')}</p>
             </div>
             <div className="glass-white p-8 md:p-12 rounded-[48px] border-4 border-primary shadow-2xl w-full max-w-2xl">
               {isPriority && (
                 <div className="flex items-center justify-center gap-3 mb-4">
                   <Star className="text-primary fill-primary" size={20} />
                   <span className="text-lg md:text-2xl font-black uppercase tracking-widest text-primary">{t('priorityToken')}</span>
                   <Star className="text-primary fill-primary" size={20} />
                 </div>
               )}
               <p className="text-7xl md:text-[120px] font-black tracking-tighter text-slate-900 leading-none py-4">B-42</p>
               <p className="text-xl md:text-3xl text-secondary font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mt-4">{t('wait')}: ~12 mins</p>
             </div>
             <button 
               onClick={() => { setStep('service'); setIsPriority(false); }}
               className="mt-4 md:mt-8 text-xl md:text-2xl font-black text-slate-400 hover:text-primary flex items-center gap-4 transition-colors"
             >
               <ArrowLeft size={32} /> {t('startOver')}
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default KioskMode;
