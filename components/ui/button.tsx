import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white border-b-4 border-primary-dark hover:brightness-105 active:border-b-0 active:translate-y-0.5',
        secondary:
          'bg-secondary text-white border-b-4 border-secondary-dark hover:brightness-105 active:border-b-0 active:translate-y-0.5',
        accent:
          'bg-accent text-brand-text border-b-4 border-accent-dark hover:brightness-105 active:border-b-0 active:translate-y-0.5',
        danger:
          'bg-danger text-white border-b-4 border-danger-dark hover:brightness-105 active:border-b-0 active:translate-y-0.5',
        outline:
          'bg-brand-surface text-brand-text border-2 border-brand-border hover:border-primary hover:text-primary active:scale-95',
        ghost:
          'bg-transparent text-brand-text hover:bg-brand-input active:scale-95',
        link:
          'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm:      'px-3 py-1.5 text-sm',
        md:      'px-5 py-2.5 text-base',
        lg:      'px-7 py-3.5 text-lg',
        icon:    'w-9 h-9 p-0',
        'icon-sm':'w-7 h-7 p-0',
        'icon-lg':'w-12 h-12 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
