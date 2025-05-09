// src/components/core/Input.tsx
/**
 * Purpose: Provides a reusable input component with styling and validation support.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { forwardRef } from 'react';
import DOMPurify from 'dompurify';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    className = '',
    ...props
  }, ref) => {
  const sanitizedClassName = DOMPurify.sanitize(className, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  return (
    <input
      ref={ref}
      className={`rounded-md py-2 px-4 font-sans transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${sanitizedClassName}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;