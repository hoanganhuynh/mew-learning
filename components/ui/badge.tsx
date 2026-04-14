import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold transition-colors text-xs px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary-dark',
        secondary: 'bg-secondary/10 text-secondary-dark',
        accent: 'bg-accent/10 text-accent-dark',
        danger: 'bg-danger/10 text-danger',
        success: 'bg-success/10 text-success',
        outline: 'border border-brand-border text-brand-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
