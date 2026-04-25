import React from 'react';
import { Ticket, MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6 lg:px-20 font-outfit relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-gold">
              <Ticket className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">
              Queue<span className="text-primary">Smart</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            India's most advanced smart queue management system. Built to solve waiting times for every citizen in Bharat.
          </p>
          <div className="flex gap-4">
             <SocialIcon icon={<Globe size={18} />} />
             <SocialIcon icon={<Sparkles size={18} />} />
             <SocialIcon icon={<Mail size={18} />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-8">Quick Access</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><Link to="/find-centers" className="hover:text-primary transition-colors">Find Centers</Link></li>
            <li><Link to="/live-status" className="hover:text-primary transition-colors">Live Tracker</Link></li>
            <li><Link to="/kiosk" className="hover:text-primary transition-colors">Kiosk Mode</Link></li>
            <li><Link to="/smart-planner" className="hover:text-primary transition-colors">Smart Visit</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-8">Support & Citizen Help</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Center Registration</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Aadhaar Help</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-slate-500">
               <div className="p-2 bg-primary/10 text-primary rounded-lg"><MapPin size={16} /></div>
               <span className="text-xs font-bold">Vidhana Soudha, Bangalore, KA</span>
             </div>
             <div className="flex items-center gap-3 text-slate-500">
               <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Phone size={16} /></div>
               <span className="text-xs font-bold">1800-425-QUEU</span>
             </div>
             <div className="flex items-center gap-3 text-slate-500">
               <div className="p-2 bg-primary/10 text-primary rounded-lg"><Mail size={16} /></div>
               <span className="text-xs font-bold">support@queuesmart.in</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          © 2026 QueueSmart India. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
           <span>Designed & Developed in Bangalore</span>
           <div className="w-4 h-4 bg-primary rounded-full" />
           <div className="w-4 h-4 bg-white border border-slate-200 rounded-full" />
           <div className="w-4 h-4 bg-secondary rounded-full" />
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
    {icon}
  </button>
);

export default Footer;
