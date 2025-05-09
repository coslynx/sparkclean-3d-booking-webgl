// src/components/sections/LandingHero.tsx
/**
 * Purpose: Integrates the 3D scene and introductory content for the landing page.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useState, useRef, useEffect } from 'react';
import RoomScene from 'src/components/3d/RoomScene';
import 'src/styles/components/landing-hero.css';
import { motion } from 'framer-motion';

interface LandingHeroProps {
  // Define props here if needed
}

const LandingHero: React.FC<LandingHeroProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        const totalHeight = rect.height;
        const progress = visibleHeight / totalHeight;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const zoomScale = 1 + scrollProgress * 0.5;

  useEffect(() => {
    const loadScene = async () => {
      try {
        // Simulate loading (replace with actual loading logic if needed)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        console.log('3D Scene loaded successfully.');
      } catch (err: any) {
        console.error('Failed to load 3D scene:', err);
        setError('Failed to load 3D scene.');
        setIsLoading(false);
      }
    };

    loadScene();
  }, []);

  return (
    <motion.div
      ref={heroRef}
      className="relative w-full min-h-80vh flex items-center justify-center bg-secondary overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        height: '80vh', // Enforce specific height for the hero section.
      }}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-secondary bg-opacity-75 z-20">
          <p className="text-xl font-bold text-primary">Loading 3D Scene...</p>
        </div>
      )}

      {error && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-100 text-red-700 z-20">
          <p>{error}</p>
        </div>
      )}

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Experience Cleaning Like Never Before</h1>
          <p className="text-lg text-gray-700">Book residential cleanings online with easy scheduling.</p>
        </div>
      </div>
      <motion.div
        className="relative z-0"
        style={{
          scale: zoomScale,
          transition: "transform 0.1s ease-out",
        }}
      >
        <RoomScene />
      </motion.div>
    </motion.div>
  );
};

export default LandingHero;