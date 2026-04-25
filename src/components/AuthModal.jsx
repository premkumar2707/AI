import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  useEffect(() => {
    if (isOpen) setIsLogin(initialMode === 'login');
  }, [isOpen, initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const loggedInUser = login(email);
      onClose();
      if (loggedInUser.isNew) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard');
      }
    } else {
      signup(email, name);
      onClose();
      navigate('/profile-setup');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden font-outfit"
          >
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative flex justify-between items-start">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-gold mb-4">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {isLogin ? 'Sign in to manage your visits' : 'Join QueueSmart today'}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-sm border border-slate-200 text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Area */}
            <div className="p-8 space-y-6 bg-white">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 transition-colors shadow-sm"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@bangalore.in" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary font-bold text-slate-700 transition-colors shadow-sm"
                    />
                  </div>
                  {isLogin && (
                    <div className="text-right mt-2">
                      <a href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot Password?</a>
                    </div>
                  )}
                </div>

                <button type="submit" className={`w-full m3-button py-4 mt-6 justify-center text-lg font-black ${isLogin ? 'm3-button-gold shadow-gold' : 'm3-button-sky shadow-blue'}`}>
                  {isLogin ? <><LogIn size={20} className="mr-2"/> Sign In</> : <><UserPlus size={20} className="mr-2"/> Sign Up</>}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-black text-slate-900 hover:text-primary transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
