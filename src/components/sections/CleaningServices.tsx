// src/components/sections/CleaningServices.tsx
 /**
  * Purpose: Displays available cleaning services with descriptions and interactive elements.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */

 import React, { useState, useEffect, useCallback } from 'react';
 import ServiceCard from 'src/components/ui/ServiceCard';
 import ProductShowcase from 'src/components/3d/ProductShowcase';
 import DOMPurify from 'dompurify';
 import 'src/styles/components/cleaning-services.css';

 interface CleaningService {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
 }

 const CleaningServices: React.FC = () => {
  const [services, setServices] = useState<CleaningService[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialServices: CleaningService[] = [
  { id: 1, name: 'Standard Cleaning', description: 'All rooms, general cleaning', imageUrl: '/public/images/service1.jpg' },
  { id: 2, name: 'Deep Cleaning', description: 'Intensive cleaning, extra attention', imageUrl: '/public/images/service2.jpg' },
  ];

  // Simulate fetching services
  const fetchServices = useCallback(async () => {
  try {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  setServices(initialServices);
  } catch (e: any) {
  console.error('Failed to fetch services:', e);
  setError('Failed to load services. Please try again later.');
  }
  }, []);

  useEffect(() => {
  fetchServices();
  }, [fetchServices]);

  const safeURL = (url: string | undefined): string => {
  try {
  if (!url) return '';
  new URL(url);
  return url;
  } catch (e) {
  console.error('Invalid URL:', url);
  return '/public/images/placeholder-service.jpg'; // Fallback to placeholder image
  }
  };

  const sanitizeDescription = (description: string): string => {
  return DOMPurify.sanitize(description);
  };

  if (error) {
  return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
  <div className="py-12 bg-white">
  <div className="container mx-auto px-4">
  <h2 className="text-2xl font-bold text-primary mb-4 text-center">Our Services</h2>
  <div className="flex flex-wrap justify-center">
  {services.map(service => (
  <ServiceCard
  key={service.id}
  name={service.name}
  description={sanitizeDescription(service.description)}
  imageUrl={safeURL(service.imageUrl)}
  />
  ))}
  </div>
  <div className="w-full p-4 mt-8">
  <ProductShowcase/>
  </div>
  </div>
  </div>
  );
 };

 export default CleaningServices;