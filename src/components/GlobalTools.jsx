import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, X, Send, Sparkles, User, Mic, PhoneOff, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GlobalTools = memo(() => {
  const { user, bookToken } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Conversational Context (for multi-turn flows)
  const [conversationContext, setConversationContext] = useState('idle');

  // Call State
  const [callState, setCallState] = useState('idle'); // idle, ringing, connected
  const [transcript, setTranscript] = useState('');
  const [agentSpeech, setAgentSpeech] = useState('');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis on mount
    synthRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        { role: 'ai', text: `Namaste ${user?.name || ''}! I am your QueueSmart AI. How can I help you skip the queue today?` }
      ]);
    }
  }, [isChatOpen, user?.name, messages.length]);

  useEffect(() => {
    if (isCalling) {
      setCallState('ringing');
      setTranscript('');
      setAgentSpeech('');
      setConversationContext('idle');
      const timer = setTimeout(() => {
        setCallState('connected');
        const greeting = `Namaste ${user?.name || ''}! Welcome to Queue Smart Bangalore Helpdesk. How can I assist you today?`;
        speakResponse(greeting);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setCallState('idle');
      setConversationContext('idle');
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    }
  }, [isCalling, user?.name]);

  const processUserInput = (text) => {
    const lowerText = text.toLowerCase();
    let response = "I'm sorry, I didn't quite catch that. Could you repeat?";

    if (conversationContext === 'waiting_for_address') {
      const area = text.split(' ')[0] || 'your';
      const centerName = `Smart Center, ${area.charAt(0).toUpperCase() + area.slice(1)}`;
      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const token = bookToken({
        center: centerName,
        service: "AI Assisted Booking",
        date: dateStr,
        status: "waiting"
      });
      
      response = `Got it. I have found a nearby center at ${centerName}. I have successfully booked your slot for ${dateStr}. Your token number is ${token.tokenId}. I have saved these details to your dashboard. Is there anything else I can help you with?`;
      setConversationContext('idle');
    }
    else if (lowerText.includes('address') || lowerText.includes('book') || lowerText.includes('nearby') || lowerText.includes('center')) {
      response = "I can help you find a nearby center and book a token right now. Could you please tell me your current address or area?";
      setConversationContext('waiting_for_address');
    }
    else if (lowerText.includes('document') || lowerText.includes('aadhaar')) {
      response = "For Aadhaar services, you will need your Original Aadhaar card, Address Proof, and two passport size photos.";
    } 
    else if (lowerText.includes('wait') || lowerText.includes('time')) {
      response = "Average wait times across Bangalore are currently thirty five percent lower than usual. It is a great time to visit!";
    } 
    else if (lowerText.includes('emergency')) {
      response = "If this is a medical emergency, please hang up and dial 1 1 2 immediately. Otherwise, I can help you book an emergency slot.";
    } 
    else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      response = `Hello ${user?.name || 'there'}! I am your intelligent Queue Smart assistant. What can I do for you today?`;
    } 
    else if (text.length > 5) {
      response = `I have noted your query regarding "${text}". I am your AI assistant, and I can help you with center wait times, required documents, or booking a token.`;
    }

    return response;
  };

  const speakResponse = (text) => {
    setAgentSpeech(text);
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95; 
    
    utterance.onend = () => {
      startListening();
    };
    
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Browser does not support Speech Recognition.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
      
      if (finalTranscript) {
        const aiResponse = processUserInput(finalTranscript);
        setTimeout(() => speakResponse(aiResponse), 800);
      }
    };
    
    recognition.onerror = (e) => {
      console.error("Speech Recognition Error:", e);
      if (e.error === 'no-speech') {
        startListening();
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const response = processUserInput(userText);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCalling(true)}
          className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center shadow-blue"
        >
          <Phone size={28} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-gold"
        >
          <MessageSquare size={28} />
        </motion.button>
      </div>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-100"
          >
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={20} /></div>
                <div>
                  <h3 className="font-black text-lg">QueueSmart AI</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm font-medium text-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-6 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-14 outline-none focus:border-primary font-bold text-slate-700"
                />
                <button type="submit" className="absolute right-2 top-2 p-2 bg-primary text-white rounded-full shadow-gold">
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Simulation Overlay */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/95 z-[200] flex flex-col items-center justify-center text-white p-6"
          >
            <div className="space-y-10 text-center max-w-2xl w-full">
              <div className="space-y-4">
                <motion.div 
                  animate={{ scale: callState === 'connected' ? [1, 1.05, 1] : [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: callState === 'connected' ? 3 : 1 }}
                  className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto relative"
                >
                  {callState === 'ringing' ? <Phone size={48} className="animate-pulse" /> : <Volume2 size={48} className="text-green-300" />}
                  {callState === 'connected' && (
                    <motion.div 
                      animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 border-2 border-green-400 rounded-full"
                    />
                  )}
                </motion.div>
                <h2 className="text-4xl font-black tracking-tight">1800-425-QUEU</h2>
                <p className="text-xl font-medium text-white/80">
                  {callState === 'ringing' ? 'Connecting to Bangalore Helpdesk...' : 'Connected • AI Agent Active'}
                </p>
              </div>

              {callState === 'connected' && (
                <div className="bg-white/10 rounded-3xl p-6 md:p-8 min-h-[200px] border border-white/20 shadow-2xl flex flex-col justify-center relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                     <motion.div 
                        className="h-full bg-green-400"
                        animate={{ width: agentSpeech ? ['0%', '100%'] : '0%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                     />
                  </div>
                  
                  {agentSpeech ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <p className="text-sm font-bold text-green-300 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Sparkles size={16} /> AI Speaking
                      </p>
                      <p className="text-2xl font-semibold leading-relaxed">"{agentSpeech}"</p>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <p className="text-sm font-bold text-blue-300 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Mic size={16} className="animate-pulse" /> Listening to you
                      </p>
                      <p className="text-2xl font-semibold leading-relaxed opacity-80 italic">
                        {transcript ? `"${transcript}"` : "Speak now..."}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-8 justify-items-center max-w-sm mx-auto">
                 <CallAction icon={<Mic />} label="Mute" />
                 <CallAction icon={<User />} label="Speaker" />
                 <CallAction icon={<MessageSquare />} label="Keypad" />
              </div>

              <button 
                onClick={() => setIsCalling(false)}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95 transition-transform"
              >
                <PhoneOff size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

const CallAction = memo(({ icon, label }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</span>
  </div>
));

export default GlobalTools;

