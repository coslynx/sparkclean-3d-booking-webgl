// src/utils/format.ts
/**
 * Purpose: Provides utility functions for data formatting, including dates, currency, phone numbers, and text truncation.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import DOMPurify from 'dompurify';

/**
 * formatDate Function
 * Formats a date string or Date object according to specified options, defaulting to en-US with short date style if options are omitted.
 * @param date - The date string or Date object to format.
 * @param options - Optional Intl.DateTimeFormatOptions to customize the formatting.
 * @returns The formatted date string.
 * @throws TypeError if the input date is invalid.
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', date);
      throw new TypeError('Invalid date provided');
    }

    const formatterOptions: Intl.DateTimeFormatOptions = options || {
      dateStyle: 'short',
    };

    return new Intl.DateTimeFormat('en-US', formatterOptions).format(dateObj);
  } catch (error: any) {
    console.error('Error formatting date:', error.message);
    throw new TypeError(`Error formatting date: ${error.message}`);
  }
};

/**
 * formatCurrency Function
 * Formats a number as currency according to specified currency and locale, defaulting to USD (en-US) if omitted.
 * @param amount - The number to format as currency.
 * @param currency - Optional currency code (e.g., USD, EUR). Defaults to USD.
 * @param locale - Optional locale (e.g., en-US, fr-CA). Defaults to en-US.
 * @returns The formatted currency string.
 * @throws TypeError if the input amount is invalid.
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.error('Invalid amount provided:', amount);
    throw new TypeError('Invalid amount provided. Must be a number.');
  }

  const sanitizedCurrency = DOMPurify.sanitize(currency, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
  const sanitizedLocale = DOMPurify.sanitize(locale, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});

  try {
    return new Intl.NumberFormat(sanitizedLocale, {
      style: 'currency',
      currency: sanitizedCurrency,
    }).format(amount);
  } catch (error: any) {
    console.error(`Error formatting currency for locale ${sanitizedLocale} and currency ${sanitizedCurrency}:`, error);
    return 'Invalid Currency';
  }
};

/**
 * formatPhoneNumber Function
 * Formats a phone number string to a consistent format (e.g., (XXX) XXX-XXXX).
 * @param phoneNumberString - The phone number string to format.
 * @returns The formatted phone number string, or the original string if formatting fails.
 */
export const formatPhoneNumber = (phoneNumberString: string): string => {
  const sanitizedNumber = phoneNumberString.replace(/[^0-9]/g, '');

  if (sanitizedNumber.length !== 10) {
    return phoneNumberString;
  }

  return `(${sanitizedNumber.substring(0, 3)}) ${sanitizedNumber.substring(3, 6)}-${sanitizedNumber.substring(6, 10)}`;
};

/**
 * truncateText Function
 * Truncates a string to a specified maximum length, adding "..." if truncated. Protects against XSS.
 * @param text - The string to truncate.
 * @param maxLength - The maximum length of the truncated string.
 * @returns The truncated string.
 * @throws TypeError if maxLength is not a positive integer.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (maxLength <= 0 || !Number.isInteger(maxLength)) {
    console.error('Invalid maxLength provided:', maxLength);
    throw new TypeError('maxLength must be a positive integer.');
  }

  if (!text) {
    return '';
  }

  const sanitizedText = DOMPurify.sanitize(text, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});

  if (sanitizedText.length <= maxLength) {
    return sanitizedText;
  }

  return sanitizedText.substring(0, maxLength) + '...';
};