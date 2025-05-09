// src/components/core/Button.tsx
/**
 * Purpose: Provides a reusable button component with consistent styling and behavior.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import React, { forwardRef } from 'react';
import DOMPurify from 'dompurify';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  type = "button",
  disabled = false,
  onClick,
  ...props
}, ref) => {
  const sanitizedClassName = DOMPurify.sanitize(className, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`rounded-md py-2 px-4 font-sans transition duration-300 ${disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary'} ${sanitizedClassName}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;