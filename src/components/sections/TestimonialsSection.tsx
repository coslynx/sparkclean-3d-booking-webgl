// src/components/sections/TestimonialsSection.tsx
/**
 * Purpose: Displays customer testimonials to build trust and credibility.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import TestimonialCard from 'src/components/ui/TestimonialCard';
import DOMPurify from 'dompurify';
import 'src/styles/components/testimonial-section.css';

interface Testimonial {
  id: number;
  author: string;
  text: string;
  imageUrl?: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialTestimonials: Testimonial[] = [
    { id: 1, author: 'John Doe', text: 'Great service! Highly recommended.', imageUrl: '/public/images/testimonial1.jpg' },
    { id: 2, author: 'Jane Smith', text: 'Professional and efficient cleaning.', imageUrl: '/public/images/testimonial2.jpg' },
  ];

  const fetchTestimonials = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestimonials(initialTestimonials);
      console.log('Testimonials loaded successfully.');
    } catch (e: any) {
      console.error('Failed to fetch testimonials:', e);
      setError('Failed to load testimonials. Please try again later.');
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const sanitizeText = (text: string): string => {
    return DOMPurify.sanitize(text);
  };

  const safeURL = (url: string | undefined): string => {
    try {
      if (!url) return '/public/images/placeholder-testimonial.jpg';
      new URL(url);
      return url;
    } catch (e) {
      console.error('Invalid URL:', url);
      return '/public/images/placeholder-testimonial.jpg'; // Fallback to placeholder image
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center">
          {testimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              author={testimonial.author}
              text={sanitizeText(testimonial.text)}
              imageUrl={safeURL(testimonial.imageUrl)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;