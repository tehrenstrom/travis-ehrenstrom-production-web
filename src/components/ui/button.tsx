import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

/* Flat Swiss buttons: hover deepens color, press is a quiet scale — no lift, no glow. */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'text-sm font-semibold',
    'rounded-md',
    'transition-[background-color,border-color,color,transform] duration-fast ease-teb-out',
    'active:scale-[.975]',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
    'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
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
        lg: 'h-12 px-7 text-base',
        sm: 'h-9 px-4 text-sm',
      },
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'hover:bg-clay-600 dark:hover:bg-clay-300',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
        ].join(' '),
        ghost: [
          'text-foreground/80',
          'hover:bg-secondary hover:text-foreground',
        ].join(' '),
        link: [
          'text-primary underline-offset-2 decoration-1 decoration-primary/40',
          'hover:underline hover:decoration-primary',
        ].join(' '),
        outline: [
          'border-thin border-foreground/35 bg-transparent text-foreground',
          'hover:bg-foreground/[0.07] hover:border-foreground/50',
        ].join(' '),
        secondary: [
          'border-thin border-foreground/35 bg-transparent text-foreground',
          'hover:bg-foreground/[0.07] hover:border-foreground/50',
        ].join(' '),
        accent: [
          'bg-accent text-accent-foreground',
          'hover:bg-gold-600 dark:hover:bg-gold-300',
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
