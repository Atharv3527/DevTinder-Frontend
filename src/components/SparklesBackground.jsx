import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SparklesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {init && (
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: false, zIndex: 0 },
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              color: { value: "#ffffff" },
              links: { enable: false },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 0.5,
                straight: false,
              },
              number: { density: { enable: true, area: 800 }, value: 400 },
              opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: { enable: true, speed: 1.5, sync: false, minimumValue: 0.1 }
              },
              shape: { type: "circle" },
              size: {
                value: { min: 0.5, max: 2.5 },
                animation: { enable: true, speed: 2.5, sync: false, minimumValue: 0.5 }
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />
      )}
      
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.3, 1] }} 
        transition={{ duration: 20, repeat: Infinity, delay: 5, ease: "easeInOut" }}
        className="absolute bottom-1/4 -right-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" 
      />
    </div>
  );
}
