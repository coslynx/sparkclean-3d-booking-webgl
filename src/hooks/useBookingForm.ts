// src/hooks/useBookingForm.ts
 /**
  * Purpose: Manages the state and submission logic for a booking form.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */
 

 import { useState, useCallback, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
 import { api } from 'src/utils/api';
 import DOMPurify from 'dompurify';
 

 /**
  * FormState Interface
  * Defines the structure for the booking form's state.
  */
 interface FormState {\n  name: string;\n  email: string;\n  phone: string;\n  date: string;\n  time: string;\n }
 

 /**
  * SubmissionResult Type
  * Defines the structure for the result of a booking submission, indicating success or failure.
  */
 type SubmissionResult = {\n  success: boolean;\n  message: string;\n } | {\n  success: boolean;\n  error: string;\n };
 

 /**
  * UseBookingForm Hook
  * Manages the state and submission logic for a booking form, including input handling,
  * validation, and API submission.
  * @returns An object containing the form state, input change handler, submit handler,
  *          submission status, and submission result.
  */
 export const useBookingForm = () => {\n  const [formState, setFormState] = useState<FormState>({\n  name: '',\n  email: '',\n  phone: '',\n  date: '',\n  time: '',\n  });
  const [isSubmitting, setIsSubmitting] = useState(false);\n  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);\n  const [validationTimeoutId, setValidationTimeoutId] = useState<NodeJS.Timeout | null>(null);\n 

  /**
   * HandleInputChange
   * Updates the form state based on changes to input elements.
   * @param event - The ChangeEvent from the input element.
   */
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {\n  const { name, value } = event.target;\n  setFormState(prevState => ({\n  ...prevState,\n  [name]: value,\n  }));\n  }, []);
 

  /**
   * Debounce Validation
   * Uses a debounce on input changes to minimize calls to validation.
   *
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  const debouncedValidate = useCallback((formState: FormState) => {\n  return new Promise<boolean>(resolve => {\n  const isValid = validateForm(formState)\n  resolve(isValid);\n  })\n  }, []);
 

  /**
   * HandleSubmit
   * Handles the form submission, performing validation and sending data to the API.
   * @param event - The FormEvent from the form submission.
   */
  const handleSubmit = useCallback(async (event: FormEvent) => {\n  event.preventDefault();
 

  const isValid = validateForm(formState);\n  if (!isValid) {\n  return;\n  }\n 

  setIsSubmitting(true);\n  setSubmissionResult(null);\n 

  try {\n  const sanitizedData = {\n  name: DOMPurify.sanitize(formState.name),\n  email: DOMPurify.sanitize(formState.email),\n  phone: DOMPurify.sanitize(formState.phone),\n  date: DOMPurify.sanitize(formState.date),\n  time: DOMPurify.sanitize(formState.time),\n  };\n 

  const response = await api.post('/bookings', sanitizedData);\n 

  if (response.status === 200 || response.status === 201) {\n  const message = response.data?.message || 'Booking submission successful!';
 

  setSubmissionResult({\n  success: true,\n  message: message,\n  });\n  console.log('Booking submission successful:', message);\n  setFormState({\n  name: '',\n  email: '',\n  phone: '',\n  date: '',\n  time: '',\n  });\n  } else {\n  const error = response.data?.error || 'Booking submission failed.';
 

  setSubmissionResult({\n  success: false,\n  error: error,\n  });
 

  console.error('Booking submission failed:', error);\n  }\n  } catch (error: any) {\n  console.error('API request failed:', error);\n  setSubmissionResult({\n  success: false,\n  error: error.message || 'An unexpected error occurred during submission.',\n  });
  } finally {\n  setIsSubmitting(false);\n  }\n  }, [formState]);
 

  /**
   * ValidateForm
   * Validates the form state, setting error messages for invalid fields.
   * @returns A boolean indicating whether the form state is valid.
   */
  const validateForm = (currentFormState: FormState): boolean => {\n  let isValid = true;\n \n\n  // Name validation\n  if (!currentFormState.name) {\n  setSubmissionResult({\n  success: false,\n  error: 'Name is required',\n  })\n  isValid = false;\n  } else if (currentFormState.name.length < 3) {\n  setSubmissionResult({\n  success: false,\n  error: 'Name must be at least 3 characters',\n  })\n  isValid = false;\n  }
 

  // Email validation\n  if (!currentFormState.email) {\n  setSubmissionResult({\n  success: false,\n  error: 'Email is required',\n  })\n  isValid = false;\n  } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(currentFormState.email)) {\n  setSubmissionResult({\n  success: false,\n  error: 'Invalid email format',\n  })\n  isValid = false;\n  }\n 

  // Phone validation\n  if (!currentFormState.phone) {\n  setSubmissionResult({\n  success: false,\n  error: 'Phone is required',\n  })\n  isValid = false;\n  } else if (!/^[0-9\\-()+ ]+$/.test(currentFormState.phone)) {\n  setSubmissionResult({\n  success: false,\n  error: 'Invalid phone number format',\n  })\n  isValid = false;\n  }\n 

  // Date validation\n  if (!currentFormState.date) {\n  setSubmissionResult({\n  success: false,\n  error: 'Date is required',\n  })\n  isValid = false;\n  } else {\n  const selectedDate = new Date(currentFormState.date);\n  const now = new Date();\n  now.setHours(0, 0, 0, 0); // Compare only dates\n  if (selectedDate < now) {\n  setSubmissionResult({\n  success: false,\n  error: 'Date must be in the future',\n  })\n  isValid = false;\n  }\n  }\n 

  // Time validation\n  if (!currentFormState.time) {\n  setSubmissionResult({\n  success: false,\n  error: 'Time is required',\n  })\n  isValid = false;\n  } else {\n  const [hours, minutes] = currentFormState.time.split(':').map(Number);\n  if (hours < 9 || hours > 17 || (hours === 17 && minutes > 0)) {\n  setSubmissionResult({\n  success: false,\n  error: 'Time must be within business hours (9 AM - 5 PM)',\n  })\n  isValid = false;\n  }\n  }\n 

  return isValid;\n  };
 

  return {\n  formState,\n  handleInputChange,\n  handleSubmit,\n  isSubmitting,\n  submissionResult,\n  };\n };