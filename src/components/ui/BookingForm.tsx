// src/components/ui/BookingForm.tsx
 /**
  * Purpose: Provides a reusable booking form component with validation and styling.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */
 

 import React, { useState, ChangeEvent, FormEvent } from 'react';
 import Input from 'src/components/core/Input';
 import Button from 'src/components/core/Button';
 import { CalendarClock, Loader2 } from 'lucide-react';
 

 interface BookingFormProps {
  formState: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent) => void;
  isSubmitting: boolean;
 }
 

 const BookingForm: React.FC<BookingFormProps> = ({
  formState,
  handleInputChange,
  handleSubmit,
  isSubmitting,
 }) => {
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
 

  const validateForm = (): boolean => {
  let isValid = true;
 

  // Name validation
  if (!formState.name) {
  setNameError('Name is required');
  isValid = false;
  } else if (formState.name.length < 3) {
  setNameError('Name must be at least 3 characters');
  isValid = false;
  } else {
  setNameError(null);
  }
 

  // Email validation
  if (!formState.email) {
  setEmailError('Email is required');
  isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
  setEmailError('Invalid email format');
  isValid = false;
  } else {
  setEmailError(null);
  }
 

  // Phone validation
  if (!formState.phone) {
  setPhoneError('Phone is required');
  isValid = false;
  } else if (!/^[0-9\-()+ ]+$/.test(formState.phone)) {
  setPhoneError('Invalid phone number format');
  isValid = false;
  } else {
  setPhoneError(null);
  }
 

  // Date validation
  if (!formState.date) {
  setDateError('Date is required');
  isValid = false;
  } else {
  const selectedDate = new Date(formState.date);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare only dates
  if (selectedDate < now) {
  setDateError('Date must be in the future');
  isValid = false;
  } else {
  setDateError(null);
  }
  }
 

  // Time validation
  if (!formState.time) {
  setTimeError('Time is required');
  isValid = false;
  } else {
  const [hours, minutes] = formState.time.split(':').map(Number);
  if (hours < 9 || hours > 17 || (hours === 17 && minutes > 0)) {
  setTimeError('Time must be within business hours (9 AM - 5 PM)');
  isValid = false;
  } else {
  setTimeError(null);
  }
  }
 

  return isValid;
  };
 

  const handleSubmitWrapper = (event: FormEvent) => {
  event.preventDefault();
  if (validateForm()) {
  handleSubmit(event);
  }
  };
 

  return (
  <form onSubmit={handleSubmitWrapper} className="w-full max-w-lg mx-auto">
  <div className="mb-4">
  <Input
  type="text"
  id="name"
  name="name"
  placeholder="Enter your name"
  value={formState.name}
  onChange={handleInputChange}
  aria-label="Enter your name"
  />
  {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
  </div>
  <div className="mb-4">
  <Input
  type="email"
  id="email"
  name="email"
  placeholder="Enter your email"
  value={formState.email}
  onChange={handleInputChange}
  aria-label="Enter your email"
  />
  {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
  </div>
  <div className="mb-4">
  <Input
  type="tel"
  id="phone"
  name="phone"
  placeholder="Enter your phone"
  value={formState.phone}
  onChange={handleInputChange}
  aria-label="Enter your phone"
  />
  {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
  </div>
  <div className="mb-4">
  <Input
  type="date"
  id="date"
  name="date"
  placeholder="Enter your date"
  value={formState.date}
  onChange={handleInputChange}
  aria-label="Enter your date"
  />
  {dateError && <p className="text-red-500 text-xs italic">{dateError}</p>}
  </div>
  <div className="mb-4">
  <Input
  type="time"
  id="time"
  name="time"
  placeholder="Enter your time"
  value={formState.time}
  onChange={handleInputChange}
  aria-label="Enter your time"
  />
  {timeError && <p className="text-red-500 text-xs italic">{timeError}</p>}
  </div>
  <div className="flex items-center justify-center">
  <Button
  type="submit"
  disabled={isSubmitting}
  >
  {isSubmitting ? (
  <div className="flex items-center">
  <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" aria-hidden="true" />
  Submitting...
  </div>
  ) : (
  "Submit"
  )}
  </Button>
  </div>
  </form>
  );
 };
 

 export default BookingForm;