import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Phone, CreditCard, ChevronRight, CheckCircle, AlertCircle, Search } from 'lucide-react';

const StaffDashboard = memo(() => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, assist, counters
  const [search, setSearch] = useState('');

  const [queue, setQueue] = useState([
    { id: '1', name: 'Ramesh Kumar', age: 68, service: 'Aadhaar Update', status: 'waiting', priority: true, time: '10:15 AM' },
    { id: '2', name: 'Sita Devi', age: 72, service: 'Pension Inquiry', status: 'waiting', priority: true, time: '10:20 AM' },
    { id: '3', name: 'Anil Gupta', age: 34, service: 'New Account', status: 'waiting', priority: false, time: '10:25 AM' },
    { id: '4', name: 'Zoya Khan', age: 29, service: 'Cash Deposit', status: 'serving', priority: false, time: '10:10 AM' },
  ]);

  const [assistForm, setAssistForm] = useState({ name: '', age: '', phone: '', service: 'Aadhaar Update' });

  const handleCallNext = () => {
    // Simple simulation: first waiting token becomes serving
    const nextIdx = queue.findIndex(q => q.status === 'waiting');
    if (nextIdx !== -1) {
      const newQueue = [...queue];
      // Mark current serving as done
      newQueue.forEach(q => { if (q.status === 'serving') q.status = 'done'; });
      // Call next
      newQueue[nextIdx].status = 'serving';
      setQueue(newQueue);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-outfit overflow-y-auto">
      {/* Sidebar Navigation */}
      <div className="flex min-h-screen">
        <aside className="w-64 bg-white h-screen sticky top-0 p-6 border-r border-slate-200 shadow-sm hidden lg:block">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Staff Panel</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Cauvery Bhavan Center</p>
          </div>
          
          <nav className="space-y-2">
            <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Users size={18} />} label="Queue Overview" />
            <NavItem active={activeTab === 'assist'} onClick={() => setActiveTab('assist')} icon={<UserPlus size={18} />} label="Assist Citizen" />
            <NavItem active={activeTab === 'counters'} onClick={() => setActiveTab('counters')} icon={<CreditCard size={18} />} label="Counter Panel" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 lg:p-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                {activeTab === 'overview' && "Live Queue Management"}
                {activeTab === 'assist' && "Assisted Token Booking"}
                {activeTab === 'counters' && "Counter Status"}
              </h1>
              <p className="text-slate-500 font-medium">Manage citizen flow efficiently.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                 onClick={handleCallNext}
                 className="m3-button m3-button-gold px-8 py-4 w-full shadow-gold font-black"
               >
                 Call Next Token <ChevronRight size={18} />
               </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="glass-white rounded-[32px] overflow-hidden border border-slate-200 shadow-lg">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                   <div className="relative flex-grow w-full max-w-md">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search by name or token ID..." 
                       className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors shadow-sm"
                     />
                   </div>
                   <div className="flex gap-4">
                     <span className="text-xs text-slate-500 font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200">Total: {queue.length}</span>
                     <span className="text-xs text-primary font-black uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20">Waiting: {queue.filter(q => q.status === 'waiting').length}</span>
                   </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-white border-b border-slate-100">
                        <th className="px-6 py-4 font-black">Citizen</th>
                        <th className="px-6 py-4 font-black">Service Type</th>
                        <th className="px-6 py-4 font-black">Status</th>
                        <th className="px-6 py-4 font-black">Wait Time</th>
                        <th className="px-6 py-4 font-black text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {queue.map(q => (
                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-sm">
                                {q.name[0]}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-2">
                                  {q.name}
                                  {q.priority && (
                                    <span className="bg-amber-100 text-amber-600 text-[8px] px-2 py-0.5 rounded-full font-black border border-amber-200">PRIORITY</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">Age: {q.age}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{q.service}</td>
                          <td className="px-6 py-4">
                             <StatusBadge status={q.status} />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">{q.time}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-slate-400 hover:text-primary transition-colors p-2"><AlertCircle size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'assist' && (
              <div className="max-w-3xl glass-white p-10 rounded-[40px] border border-slate-200 space-y-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <InputGroup label="Citizen Full Name" placeholder="e.g. Rahul Sharma" />
                   <InputGroup label="Phone Number (Optional)" placeholder="+91 XXXXX XXXXX" icon={<Phone size={16} />} />
                   <InputGroup label="Age" placeholder="e.g. 65" type="number" />
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Service Type</label>
                     <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors appearance-none shadow-sm">
                       <option>Aadhaar Update</option>
                       <option>New Account Opening</option>
                       <option>Pension Inquiry</option>
                       <option>Document Verification</option>
                     </select>
                   </div>
                </div>

                <div className="flex items-start md:items-center gap-4 p-6 bg-secondary/5 rounded-3xl border border-secondary/20 shadow-sm">
                   <div className="p-3 bg-white rounded-2xl shadow-sm text-secondary border border-slate-100">
                     <Users size={24} />
                   </div>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">
                     Tokens booked via Assistance are automatically flagged for <strong className="text-slate-900 font-black">Priority Queue</strong> if age is 60+ or disability is noted.
                   </p>
                </div>

                <button className="w-full m3-button m3-button-sky py-6 justify-center text-xl font-black shadow-blue">
                  Generate Assisted Token
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
});

const NavItem = memo(({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${active ? 'bg-primary text-white shadow-gold' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
));

const StatusBadge = memo(({ status }) => {
  const styles = {
    waiting: 'bg-blue-50 text-blue-600 border-blue-200',
    serving: 'bg-green-50 text-green-600 border-green-200',
    done: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
});

const InputGroup = memo(({ label, placeholder, type = 'text', icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input 
        type={type} 
        placeholder={placeholder} 
        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors shadow-sm ${icon ? 'pl-12' : ''}`}
      />
    </div>
  </div>
));

export default StaffDashboard;
