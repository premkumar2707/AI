import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const QueueBackground3D = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 5]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-900 perspective-[1000px]">
      <motion.div 
        style={{ y, rotateX }}
        className="absolute inset-[-20%] w-[140%] h-[140%] origin-bottom"
      >
        {/* We use a high quality walking crowd video to simulate Bengaluru queue/sector activity */}
        <iframe
          className="w-full h-full opacity-40 mix-blend-screen scale-[1.2] pointer-events-none"
          src="https://www.youtube.com/embed/1B1aYnLwD88?autoplay=1&mute=1&loop=1&playlist=1B1aYnLwD88&controls=0&showinfo=0&modestbranding=1&disablekb=1&playsinline=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Bengaluru Queue Background"
        />
        
        {/* Dynamic 3D Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [transform:rotateX(60deg)_translateZ(-200px)_scale(1.5)] opacity-30 animate-grid-flow" />
        
        {/* Vignette & Color Grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 mix-blend-overlay" />
      </motion.div>
    </div>
  );
};

export default QueueBackground3D;
