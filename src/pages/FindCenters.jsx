import React, { useState, useCallback, useMemo, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { centers, getQueueColor } from '../utils/mockData';
import { Clock, Navigation, Users, ArrowRight, X, MapPin, Search, Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const mapGoldStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
];

const FindCenters = () => {
  const { user, bookToken } = useAuth();
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  const filteredCenters = useMemo(() => {
    if (!searchQuery) return centers;
    const q = searchQuery.toLowerCase();
    const matches = centers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.address.toLowerCase().includes(q)
    );
    
    if (matches.length === 0) {
      // Fallback: Return top 3 closest centers as "nearby"
      return centers.slice(0, 3);
    }
    return matches;
  }, [searchQuery]);

  const hasExactMatch = useMemo(() => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return centers.some(c => 
      c.name.toLowerCase().includes(q) || 
      c.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const mapCenter = useMemo(() => {
    if (selectedCenter) {
      return { lat: selectedCenter.lat, lng: selectedCenter.lng };
    }
    if (searchQuery && filteredCenters.length > 0) {
      return { lat: filteredCenters[0].lat, lng: filteredCenters[0].lng };
    }
    return defaultCenter;
  }, [searchQuery, filteredCenters, selectedCenter]);

  const mapZoom = useMemo(() => {
    if (selectedCenter) return 16;
    if (searchQuery && filteredCenters.length > 0) return 14;
    return 12;
  }, [searchQuery, filteredCenters, selectedCenter]);

  if (loadError) {
    return <div className="p-20 text-center text-red-500 bg-white min-h-screen">Error loading Maps.</div>;
  }

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden font-outfit">
      {/* Search Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-6 flex flex-col items-center">
        <div className="glass-white rounded-3xl px-6 py-4 border border-primary/20 flex items-center gap-4 shadow-xl w-full">
          <Search size={22} className="text-primary" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bangalore centers..." 
            className="bg-transparent border-none outline-none text-slate-800 w-full font-bold text-lg"
          />
        </div>
        <AnimatePresence>
          {!hasExactMatch && searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-xs md:text-sm font-bold text-orange-600 bg-orange-50/90 backdrop-blur-md py-2 px-5 rounded-full border border-orange-200 shadow-sm"
            >
              Exact match not found. Showing nearest available centers.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapZoom}
          options={{ styles: mapGoldStyles, disableDefaultUI: true, animation: window.google?.maps?.Animation?.DROP }}
        >
          {filteredCenters.map(item => (
            <Marker
              key={item.id}
              position={{ lat: item.lat, lng: item.lng }}
              onClick={() => setSelectedCenter(item)}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 flex-col gap-8 p-10 pt-24 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
             {filteredCenters.map(c => (
               <CenterCard key={c.id} center={c} onSelect={setSelectedCenter} />
             ))}
          </div>
        </div>
      )}

      {/* Bottom Drawer */}
      <AnimatePresence>
        {selectedCenter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCenter(null)}
              className="absolute inset-0 bg-slate-900/40 z-20 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute bottom-0 left-0 w-full glass-white rounded-t-[50px] z-30 p-10 md:p-16 border-t border-primary/20 shadow-2xl"
            >
              <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-10" />
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{selectedCenter.name}</h2>
                    <p className="text-slate-500 flex items-center gap-3 text-lg font-medium">{selectedCenter.address}</p>
                  </div>
                  <div className="text-right p-6 bg-primary/5 rounded-[40px] border border-primary/10">
                     <div className="text-6xl font-black text-primary">{selectedCenter.queueSize}</div>
                     <p className="text-xs uppercase tracking-widest text-primary/60 font-black">Waiting</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <InfoCard icon={<Clock className="text-primary" />} label="Wait" value={`${selectedCenter.queueSize * 4}m`} />
                  <InfoCard icon={<Users className="text-secondary" />} label="Staff" value="4 Active" />
                  <InfoCard icon={<Clock className="text-green-500" />} label="Open" value={selectedCenter.hours} />
                  <InfoCard icon={<Navigation className="text-blue-500" />} label="Dist" value="1.2km" />
                </div>

                <button 
                  onClick={() => {
                    if (!user) {
                      alert("Please login to join the queue.");
                      navigate('/');
                      return;
                    }
                    bookToken({
                      center: selectedCenter.name,
                      service: "General Checkup / Inquiry",
                      date: new Date().toLocaleDateString()
                    });
                    navigate('/dashboard');
                  }}
                  className="w-full m3-button m3-button-gold py-6 justify-center text-2xl shadow-gold font-black"
                >
                  Join Queue <ArrowRight size={32} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CenterCard = memo(({ center, onSelect }) => (
  <button 
    onClick={() => onSelect(center)}
    className="glass-white px-6 py-6 rounded-[32px] border border-slate-100 shadow-xl transition-all text-left group hover:scale-[1.02]"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary"><MapPin size={20} /></div>
      <div className="text-2xl font-black text-primary">{center.queueSize}</div>
    </div>
    <h3 className="text-lg font-black text-slate-900 mb-1">{center.name}</h3>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{center.address}</p>
  </button>
));

const InfoCard = memo(({ icon, label, value }) => (
  <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-3 mb-2 opacity-60">
      {icon}
      <span className="text-[8px] uppercase font-black tracking-widest">{label}</span>
    </div>
    <div className="text-xl font-black text-slate-800">{value}</div>
  </div>
));

export default FindCenters;
