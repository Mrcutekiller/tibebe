'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="form-group w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'input-error',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

// Phone Input with +251 prefix
interface PhoneInputProps extends Omit<InputProps, 'leftIcon'> {}

export function PhoneInput({ className, label, error, hint, placeholder, ...props }: PhoneInputProps) {
  return (
    <div className="form-group w-full">
      {label && (
        <label className="label">{label}</label>
      )}
      <div className="relative flex">
        <span className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50 text-sm font-medium text-gray-600 whitespace-nowrap">
          🇪🇹 +251
        </span>
        <input
          {...props}
          className={cn(
            'input rounded-l-none border-l-0',
            error && 'input-error',
            className
          )}
          placeholder={placeholder || '9XX XXX XXXX'}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
