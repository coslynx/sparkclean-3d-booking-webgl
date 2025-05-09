// src/components/sections/BookingSection.tsx
/**
 * Purpose: Integrates a booking form for users to schedule cleaning services.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { useState, useEffect } from 'react';
import BookingForm from 'src/components/ui/BookingForm';
import { useBookingForm } from 'src/hooks/useBookingForm';
import DOMPurify from 'dompurify';
import 'src/styles/components/booking-section.css';

const BookingSection: React.FC = () => {
  const {
    formState,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submissionResult,
  } = useBookingForm();

  useEffect(() => {
    if (submissionResult) {
      if (submissionResult.success) {
        console.log('Booking submission successful:', submissionResult.message);
        // Reset the form or show a success message to the user
      } else {
        console.error('Booking submission failed:', submissionResult.error);
        // Display an error message to the user
      }
    }
  }, [submissionResult]);

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Book Your Cleaning</h2>

        <BookingForm
          formState={{
            name: DOMPurify.sanitize(formState.name),
            email: DOMPurify.sanitize(formState.email),
            phone: DOMPurify.sanitize(formState.phone),
            date: DOMPurify.sanitize(formState.date),
            time: DOMPurify.sanitize(formState.time),
          }}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {isSubmitting && (
          <div className="flex items-center justify-center mt-4" role="alert" aria-live="polite">
            <svg className="animate-spin h-5 w-5 mr-3 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700">Submitting...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSection;