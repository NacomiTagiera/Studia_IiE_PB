import React from 'react';
import { type IconType } from 'react-icons';
import { type LucideIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { Button, type ButtonProps } from './button';

interface Props extends Omit<ButtonProps, 'asChild' | 'leadingICon' | 'trailingICon'> {
	icon: IconType | LucideIcon;
	label: string;
	tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
	tooltipAlign?: 'start' | 'center' | 'end';
}

export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
	({ icon, label, className, tooltipSide = 'top', tooltipAlign = 'center', ...rest }, ref) => {
		return (
			<TooltipProvider>
				<Tooltip delayDuration={300}>
					<TooltipTrigger asChild>
						<Button
							ref={ref}
							aria-label={label}
							type="button"
							className={cn('rounded-full', className)}
							variant="secondary"
							size="icon"
							{...rest}
						>
							{React.createElement(icon, { className: 'size-6', 'aria-hidden': true })}
						</Button>
					</TooltipTrigger>
					<TooltipContent side={tooltipSide} align={tooltipAlign}>
						<p className="text-sm">{label}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	},
);

IconButton.displayName = 'IconButton';
