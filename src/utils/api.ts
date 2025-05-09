// src/utils/api.ts
/**
 * Purpose: Provides a set of asynchronous functions for interacting with the backend API.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import asyncRetry from 'async-retry';
import DOMPurify from 'dompurify';

/**
 * ApiError Class
 * Custom error class for API-related errors, including status codes.
 */
class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype); // restore prototype chain
  }
}

/**
 * Booking Interface
 * Defines the structure for a booking object.
 */
interface Booking {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

/**
 * Testimonial Interface
 * Defines the structure for a testimonial object.
 */
interface Testimonial {
  id: number;
  author: string;
  text: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  console.error('VITE_API_BASE_URL is not defined in the environment variables.');
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error(`Invalid base URL: ${url}`);
    return false;
  }
};

const baseApiUrl = isValidUrl(baseUrl) ? baseUrl : '/api';

// Rate limiting implementation using a leaky bucket algorithm
const MAX_REQUESTS_PER_MINUTE = 10;
const BUCKET_SIZE = MAX_REQUESTS_PER_MINUTE;
const REFILL_INTERVAL = 60000; // 1 minute
let currentBucketSize = BUCKET_SIZE;
let lastRefillTimestamp = Date.now();

const sanitizeString = (str: string): string => {
  return encodeURIComponent(DOMPurify.sanitize(str, {ALLOWED_TAGS: [], ALLOWED_ATTR: []}));
};

/**
 * Rate Limiter Function
 * Checks if a request can be sent based on the leaky bucket algorithm.
 * Throws an error if the rate limit is exceeded.
 */
const checkRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timePassed = now - lastRefillTimestamp;
  const refillAmount = (timePassed / REFILL_INTERVAL) * BUCKET_SIZE;
  currentBucketSize = Math.min(BUCKET_SIZE, currentBucketSize + refillAmount);
  lastRefillTimestamp = now;

  if (currentBucketSize >= 1) {
    currentBucketSize -= 1;
  } else {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
};

/**
 * Submit Booking Function
 * Submits a booking object to the backend API.
 * @param booking - The booking object to submit.
 * @returns A Promise that resolves with the API response or rejects with an ApiError.
 */
const submitBooking = async (booking: Booking): Promise<AxiosResponse> => {
  await checkRateLimit();

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phoneRegex = /^[0-9\s-()+]+$/;

  if (!emailRegex.test(booking.email)) {
    throw new Error('Invalid email format');
  }

  if (!phoneRegex.test(booking.phone)) {
    throw new Error('Invalid phone number format');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await asyncRetry(
      async () => {
        const sanitizedBooking = {
          name: sanitizeString(booking.name),
          email: sanitizeString(booking.email),
          phone: sanitizeString(booking.phone),
          date: sanitizeString(booking.date),
          time: sanitizeString(booking.time),
        };

        return await axios.post(`${baseApiUrl}/bookings`, sanitizedBooking, {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error: Error) => {
          console.log('Retrying API request:', error.message);
        },
      }
    );
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    const status = error.response?.status || 500;
    console.error('API request failed:', error);
    throw new ApiError(error.message || 'Failed to submit booking', status);
  }
};

/**
 * Fetch Testimonials Function
 * Fetches testimonials from the backend API.
 * @returns A Promise that resolves with an array of Testimonial objects or rejects with an ApiError.
 */
const fetchTestimonials = async (): Promise<Testimonial[]> => {
  await checkRateLimit();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await asyncRetry(
      async () => {
        return await axios.get(`${baseApiUrl}/testimonials`, {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error: Error) => {
          console.log('Retrying API request:', error.message);
        },
      }
    );
    clearTimeout(timeoutId);

    if (Array.isArray(response.data)) {
      const testimonials: Testimonial[] = response.data.map((item: any) => ({
        id: item.id,
        author: item.author,
        text: item.text,
      }));
      return testimonials;
    } else {
      throw new Error('Data format from API is incorrect. Expected an array.');
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    const status = error.response?.status || 500;
    console.error('API request failed:', error);
    throw new ApiError(error.message || 'Failed to fetch testimonials', status);
  }
};

export const api = {
  post: axios.post,
  get: axios.get,
  submitBooking,
  fetchTestimonials,
};