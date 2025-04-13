import React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'focus:ring-brand flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-base text-white outline-none ring-1 ring-inset ring-input placeholder:text-muted-foreground/70 hover:ring-2 focus:border-none focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };
