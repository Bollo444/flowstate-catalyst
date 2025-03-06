import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border bg-[#1E1E1E] px-3 text-sm ring-offset-background',
        'focus:ring-2 focus:ring-[#50B584] focus:ring-offset-2',
        'disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
