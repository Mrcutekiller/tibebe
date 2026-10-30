'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

// ---- Badge ----

type BadgeVariant = 'green' | 'gold' | 'red' | 'gray' | 'cream';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariantClass: Record<BadgeVariant, string> = {
  green: 'badge-green',
  gold: 'badge-gold',
  red: 'badge-red',
  gray: 'badge-gray',
  cream: 'badge-cream',
};

export function Badge({ children, variant = 'green', className }: BadgeProps) {
  return (
    <span className={cn('badge', badgeVariantClass[variant], className)}>
      {children}
    </span>
  );
}

// ---- Chip / Filter Pill ----

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active = false, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('chip', active && 'chip-active', className)}
    >
      {children}
    </button>
  );
}

// ---- Star Rating ----

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  reviews?: number;
  className?: string;
}

export function StarRating({ rating, maxStars = 5, size = 14, showValue = true, reviews, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="stars">
        {Array.from({ length: maxStars }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? 'currentColor' : 'none'}
            className={i < Math.round(rating) ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold" style={{ color: 'var(--color-ink-light)' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviews !== undefined && (
        <span className="text-xs" style={{ color: 'var(--color-gray-400)' }}>
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}

// ---- Progress Bar ----

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, className, showLabel, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-gray-500)' }}>
          <span>{label}</span>
          <span className="font-semibold">{clamped}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

// ---- Lock Badge ----

export function LockBadge({ className }: { className?: string }) {
  return (
    <span className={cn('badge-gold badge', className)}>
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V3.5C8 1.567 6.657 0 5 0S2 1.567 2 3.5V5H1C.448 5 0 5.448 0 6v5c0 .552.448 1 1 1h8c.552 0 1-.448 1-1V6c0-.552-.448-1-1-1H8z" fill="currentColor"/>
      </svg>
      Locked
    </span>
  );
}

// ---- Free Badge ----

export function FreeBadge({ className }: { className?: string }) {
  return (
    <span className={cn('badge-green badge', className)}>
      ✓ Free
    </span>
  );
}
