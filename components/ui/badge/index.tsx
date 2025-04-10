'use client'

import React from 'react'

type BadgeProps = {
  text: string
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

export default function Badge({ text, color = 'gray' }: BadgeProps) {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-[2px]  rounded text-xs font-medium ${colorClasses[color]}`}
    >
      {text}
    </span>
  )
}
