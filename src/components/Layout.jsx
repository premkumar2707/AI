import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import GlobalTools from './GlobalTools';

const Layout = () => {
  const location = useLocation();
  const isKiosk = location.pathname === '/kiosk';
  const isSimulation = location.pathname === '/simulation';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors duration-300 font-outfit">
      {/* Live Sync Status Bar */}
      <div className="bg-slate-900 text-white py-1 px-4 flex items-center justify-center gap-4 z-[200]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Real-time DB Connected</span>
        </div>
        <div className="hidden sm:block text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">
          Syncing Bangalore Centers...
        </div>
      </div>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {!isKiosk && !isSimulation && <Footer />}
      
      {/* Universal Floating AI & Call Tools */}
      <GlobalTools />
    </div>
  );
};

export default Layout;
