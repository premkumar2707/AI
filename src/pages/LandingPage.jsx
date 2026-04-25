import React, { memo, useState } from 'react';
import { ShieldCheck, MapPin, Ticket, Clock, LogIn, Users, Smartphone, Sparkles, Star, ArrowRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col font-outfit bg-white">
      {/* Optimized Background Layer */}
      <div className="absolute inset-0 z-0 bg-slate-50">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          style={{ filter: 'brightness(1.1)' }}
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-city-skyline-at-night-with-bright-lights-1188-large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-secondary-light/10 to-primary-light/10" />
      </div>

      {/* Simplified Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-secondary-light/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary-light/10 rounded-full blur-2xl" />
      </div>

      {/* Navigation */}
      <nav className="relative w-full z-50 px-6 py-6 flex justify-between items-center lg:px-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-gold">
            <Ticket className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">
            Queue<span className="text-primary">Smart</span>
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-xs font-black text-slate-500 uppercase tracking-widest items-center">
          {user && <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>}
          {user && <Link to="/profile-setup" className="hover:text-primary transition-colors">Profile & KYC</Link>}
          <Link to="/find-centers" className="hover:text-primary transition-colors">Find Centers</Link>
          <Link to="/smart-planner" className="hover:text-primary transition-colors">Smart Planner</Link>
          <Link to="/staff" className="m3-button m3-button-gold py-2 px-6">Admin</Link>
          {user && (
            <button onClick={logout} className="hover:text-rose-500 transition-colors flex items-center gap-1">
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-20 flex-grow flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="glass-white m3-card p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-light/20 text-secondary-dark rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} /> Built for Bharat
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-tight tracking-tighter">
                  Queue<span className="text-primary italic">Smart</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                  "Book your slot. Skip the wait. <br />
                  <span className="text-secondary font-black underline decoration-primary/30">Experience Bangalore</span> smarter."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {user ? (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full sm:w-auto m3-button m3-button-gold px-10 py-5 text-lg shadow-gold"
                    >
                      Dashboard <ArrowRight size={20} className="ml-2" />
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full sm:w-auto m3-button m3-button-sky px-10 py-5 text-lg shadow-blue"
                    >
                      <LogOut size={20} className="mr-2" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => openAuth('login')}
                      className="w-full sm:w-auto m3-button m3-button-gold px-10 py-5 text-lg shadow-gold"
                    >
                      <LogIn size={20} className="mr-2"/> Sign In
                    </button>
                    <button 
                      onClick={() => openAuth('signup')}
                      className="w-full sm:w-auto m3-button m3-button-sky px-10 py-5 text-lg shadow-blue"
                    >
                      <Users size={20} className="mr-2"/> Sign Up
                    </button>
                  </div>
                )}
                
                <Link to="/kiosk" className="w-full sm:w-auto m3-button bg-white text-slate-700 border-2 border-slate-200 px-10 py-5 text-lg shadow-sm hover:border-slate-300">
                  <Smartphone size={20} className="mr-2"/> Kiosk Mode
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                <StatItem val="20k+" label="Tokens" color="text-primary" />
                <StatItem val="500+" label="Centers" color="text-secondary" />
                <StatItem val="2h" label="Saved" color="text-primary" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Optimized Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
          <FeatureCard to="/find-centers" icon={<MapPin className="text-secondary" />} label="Find Centers" />
          <FeatureCard to="/live-status" icon={<Ticket className="text-primary" />} label="Live Tracker" />
          <FeatureCard to="/simulation" icon={<Smartphone className="text-secondary" />} label="SMS/IVR Demo" />
          <FeatureCard to="/smart-planner" icon={<Clock className="text-primary" />} label="Visit Planner" />
          <FeatureCard to="/staff" icon={<ShieldCheck className="text-secondary" />} label="Staff Panel" />
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 text-slate-300 font-black uppercase tracking-widest text-[9px]">
        <span>Designed in Bangalore 🇮🇳</span>
      </div>

      {/* Auth Modal UI */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
    </div>
  );
};

const StatItem = ({ val, label, color }) => (
  <div className="space-y-1">
    <p className={`text-2xl md:text-3xl font-black ${color}`}>{val}</p>
    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-black">{label}</p>
  </div>
);

const FeatureCard = memo(({ to, icon, label }) => (
  <Link to={to} className="block group">
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-white p-6 rounded-[32px] flex flex-col items-center gap-3 border-white/40 shadow-lg hover:shadow-gold/10 transition-all cursor-pointer h-full border text-center"
    >
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary">
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </motion.div>
  </Link>
));

export default LandingPage;
