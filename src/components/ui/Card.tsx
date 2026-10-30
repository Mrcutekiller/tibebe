'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, padding = true, onClick }: CardProps) {
  return (
    <div
      className={cn('card', hover && 'cursor-pointer', padding && 'p-5', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('card p-5 flex flex-col gap-3', className)}>
      <div className="skeleton h-40 w-full rounded-xl" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-8 w-full rounded-lg" />
    </div>
  );
}

export default Card;
