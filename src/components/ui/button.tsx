import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'text-sm font-medium tracking-wide',
    'rounded-full', /* Organic pill shape */
    'ring-offset-background transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-11 px-7',
        icon: 'h-11 w-11',
        lg: 'h-13 px-9 text-base',
        sm: 'h-9 px-5 text-sm',
      },
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'shadow-lg shadow-primary/20',
          'hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'shadow-lg shadow-destructive/20',
          'hover:bg-destructive/90 hover:shadow-xl',
        ].join(' '),
        ghost: [
          'hover:bg-secondary/60 hover:text-secondary-foreground',
        ].join(' '),
        link: [
          'text-foreground',
          'underline-offset-4 decoration-2 decoration-accent/40',
          'hover:decoration-accent hover:text-accent',
        ].join(' '),
        outline: [
          'border-2 border-border bg-transparent',
          'hover:bg-secondary/40 hover:border-primary/40 hover:-translate-y-1',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground',
          'shadow-md shadow-secondary/30',
          'hover:-translate-y-1 hover:shadow-lg hover:bg-secondary/80',
        ].join(' '),
        accent: [
          'bg-accent text-accent-foreground',
          'shadow-lg shadow-accent/30',
          'hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/40 hover:bg-accent/90',
        ].join(' '),
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
