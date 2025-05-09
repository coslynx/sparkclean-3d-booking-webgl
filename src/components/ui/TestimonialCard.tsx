// src/components/ui/TestimonialCard.tsx
/**
 * Purpose: Displays a single customer testimonial with author and text.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React from 'react';
import DOMPurify from 'dompurify';
import 'src/styles/components/testimonial-card.css';

interface TestimonialCardProps {
  author: string;
  text: string;
  imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ author, text, imageUrl }) => {

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

  const sanitizedText = DOMPurify.sanitize(text);

  return (
    <div className="w-64 bg-secondary shadow-md rounded-md overflow-hidden font-sans">
      <img
        src={safeURL(imageUrl)}
        alt={`Testimonial by ${author}`}
        className="object-cover h-40 w-full"
        onError={(e: any) => {
          console.error('Failed to load image:', imageUrl);
          e.target.onerror = null;
          e.target.src = '/public/images/placeholder-testimonial.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2">{author}</h3>
        <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: sanitizedText }}></p>
      </div>
    </div>
  );
};

export default TestimonialCard;