import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl bg-white shadow-lg text-gray-900', // Added border color and shadow-lg
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-6', className)} // Adjusted padding and spacing
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-semibold text-gray-800', className)} // Updated font color and size
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm text-gray-500', className)} // Slightly lighter color for description
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between p-6 bg-gray-100',
      className
    )} // Added footer bg color
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
