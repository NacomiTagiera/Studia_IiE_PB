import React from 'react';
import { type IconType } from 'react-icons';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { type UrlObject } from 'url';

import { cn } from '@/lib/utils';

import { ActiveLink } from './active-link';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline: 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-slate-950 text-slate-400 shadow-sm hover:bg-slate-900 hover:text-white',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-neutral-400 underline-offset-4 hover:underline',
				text: 'bg-transparent text-foreground hover:text-primary',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	href?: string | UrlObject;
	activeClassName?: string;
	leadingIcon?: LucideIcon | IconType;
	trailingIcon?: LucideIcon | IconType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			asChild = false,
			children,
			variant,
			size,
			className,
			activeClassName,
			href,
			leadingIcon: LeadingIcon,
			trailingIcon: TrailingIcon,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		if (href) {
			return (
				<ActiveLink
					href={href}
					exact={false}
					aria-label={props['aria-label']}
					className={cn(buttonVariants({ variant, size, className }))}
					activeClassName={activeClassName}
				>
					{LeadingIcon && <LeadingIcon className="mr-2 size-5" aria-hidden />}
					{children}
					{TrailingIcon && <TrailingIcon className="ml-2 size-5" aria-hidden />}
				</ActiveLink>
			);
		}

		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
				{LeadingIcon && <LeadingIcon className="mr-2 size-5" aria-hidden />}
				{children}
				{TrailingIcon && <TrailingIcon className="ml-2 size-5" aria-hidden />}
			</Comp>
		);
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
