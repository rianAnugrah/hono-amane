'use client'

import React from 'react'

type BadgeVariant = 'filled' | 'light' | 'outline';
type BadgeSize = 'sm' | 'md';

type BadgeProps = {
  text: string;
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export default function Badge({ 
  text, 
  color = 'gray', 
  variant = 'light',
  size = 'md',
  icon
}: BadgeProps) {
  const colorClasses: Record<string, Record<BadgeVariant, string>> = {
    gray: {
      filled: 'bg-gray-500 text-white',
      light: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-800'
    },
    blue: {
      filled: 'bg-blue-500 text-white',
      light: 'bg-blue-50 text-blue-700',
      outline: 'border border-blue-400 text-blue-700'
    },
    green: {
      filled: 'bg-green-500 text-white',
      light: 'bg-green-50 text-green-700',
      outline: 'border border-green-400 text-green-700'
    },
    red: {
      filled: 'bg-red-500 text-white',
      light: 'bg-red-50 text-red-700',
      outline: 'border border-red-400 text-red-700'
    },
    yellow: {
      filled: 'bg-yellow-500 text-white',
      light: 'bg-yellow-50 text-yellow-800',
      outline: 'border border-yellow-400 text-yellow-800'
    },
    purple: {
      filled: 'bg-purple-500 text-white',
      light: 'bg-purple-50 text-purple-700',
      outline: 'border border-purple-400 text-purple-700'
    },
    indigo: {
      filled: 'bg-indigo-500 text-white',
      light: 'bg-indigo-50 text-indigo-700',
      outline: 'border border-indigo-400 text-indigo-700'
    }
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium
        ${colorClasses[color][variant]}
        ${sizeClasses[size]}
        ${variant === 'outline' ? 'bg-transparent' : ''}
        rounded-full
        max-w-full overflow-hidden text-ellipsis whitespace-nowrap
      `}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      <span className="truncate">{text}</span>
    </span>
  )
}
