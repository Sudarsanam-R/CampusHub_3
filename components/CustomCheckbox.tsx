// CustomCheckbox.tsx
'use client'

import { InputHTMLAttributes } from 'react'
import { ReactNode } from 'react';

interface CustomCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export default function CustomCheckbox({ label, ...props }: CustomCheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="peer hidden"
          {...props}
        />
        <div className="w-5 h-5 rounded-sm border border-gray-500 bg-transparent peer-checked:bg-indigo-500 transition-all duration-200"></div>
        <svg
          className="absolute top-0 left-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}