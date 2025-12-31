import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'text-label uppercase tracking-stamp font-semibold',
    'ring-offset-background transition-all duration-200',
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
        default: 'h-11 px-6',
        icon: 'h-11 w-11',
        lg: 'h-12 px-8 text-sm tracking-vintage',
        sm: 'h-9 px-4 text-label-sm',
      },
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'border border-primary',
          'shadow-vintage',
          'hover:-translate-y-0.5 hover:shadow-vintage-lg',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'border border-destructive',
          'shadow-vintage',
          'hover:bg-destructive/90',
        ].join(' '),
        ghost: [
          'hover:bg-secondary hover:text-secondary-foreground',
        ].join(' '),
        link: [
          'text-foreground',
          'underline-offset-4 decoration-1 decoration-foreground/30',
          'hover:decoration-accent hover:text-accent',
        ].join(' '),
        outline: [
          'border border-border bg-card',
          'shadow-vintage-inset',
          'hover:-translate-y-0.5 hover:shadow-vintage hover:border-foreground/30',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border border-border',
          'shadow-vintage',
          'hover:-translate-y-0.5 hover:shadow-vintage-lg hover:bg-secondary/80',
        ].join(' '),
        accent: [
          'bg-accent text-accent-foreground',
          'border border-accent',
          'shadow-vintage',
          'hover:-translate-y-0.5 hover:shadow-vintage-lg hover:bg-accent/90',
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
