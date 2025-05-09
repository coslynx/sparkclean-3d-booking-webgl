// src/pages/HomePage.tsx
/**
 * Purpose: Defines the main landing page, integrating all sections and components.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { Suspense } from 'react';
import LandingHero from 'src/components/sections/LandingHero';
import CleaningServices from 'src/components/sections/CleaningServices';
import BookingSection from 'src/components/sections/BookingSection';
import TestimonialsSection from 'src/components/sections/TestimonialsSection';
import { useScroll } from 'src/hooks/useScroll';
import MinimalLayout from 'src/components/layout/MinimalLayout';

/**
 * HomePage Component
 * Integrates various sections to create the main landing page for the cleaning service application.
 */
const HomePage: React.FC = () => {
  useScroll();

  return (
    <div className="bg-white">
      <Suspense fallback={<div className="text-center">Loading Hero Section...</div>}>
        <LandingHero />
      </Suspense>
      <Suspense fallback={<div className="text-center">Loading Services Section...</div>}>
        <CleaningServices />
      </Suspense>
      <Suspense fallback={<div className="text-center">Loading Booking Section...</div>}>
        <BookingSection />
      </Suspense>
      <Suspense fallback={<div className="text-center">Loading Testimonials Section...</div>}>
        <TestimonialsSection />
      </Suspense>
    </div>
  );
};

export default HomePage;