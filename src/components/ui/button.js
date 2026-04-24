import * as React from 'react';
import { cn } from '../../lib/utils';
const variantStyles = {
    default: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm',
    outline: 'border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white',
};
const sizeStyles = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-6 text-base',
    icon: 'h-8 w-8 p-0',
};
export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => (<button ref={ref} className={cn('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer', variantStyles[variant], sizeStyles[size], className)} {...props}/>));
Button.displayName = 'Button';
