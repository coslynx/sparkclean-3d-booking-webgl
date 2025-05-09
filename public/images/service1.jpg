// src/components/ui/ServiceCard.tsx
/**
 * Purpose: Displays a single cleaning service with details and a booking option.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React from 'react';
import Button from 'src/components/core/Button';
import DOMPurify from 'dompurify';
import 'src/styles/components/service-card.css';

interface ServiceCardProps {
  name: string;
  description: string;
  imageUrl?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, description, imageUrl }) => {

  const safeURL = (url: string | undefined): string => {
    try {
      if (!url) return '/public/images/placeholder-service.jpg';
      new URL(url);
      return url;
    } catch (e) {
      console.error('Invalid URL:', url);
      return '/public/images/placeholder-service.jpg'; // Fallback to placeholder image
    }
  };

  const sanitizedDescription = DOMPurify.sanitize(description);

  const handleBookNowClick = () => {
    console.log(`Book Now clicked for ${name}`);
  };

  return (
    <div className="w-64 bg-secondary shadow-md rounded-md overflow-hidden font-sans">
      <img
        src={safeURL(imageUrl)}
        alt={name}
        className="object-cover h-40 w-full"
        onError={(e: any) => {
          console.error('Failed to load image:', imageUrl);
          e.target.onerror = null;
          e.target.src = '/public/images/placeholder-service.jpg';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
        <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
        <div className="mt-4">
          <Button onClick={handleBookNowClick}>Book Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;