'use client';

import { useFormStatus } from 'react-dom';
import { Loader } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button, type ButtonProps } from '../ui/button';

export const ActionButton = ({ children, className, leadingIcon, trailingIcon, ...rest }: ButtonProps) => {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			size="lg"
			aria-disabled={pending}
			leadingIcon={!pending ? leadingIcon : undefined}
			trailingIcon={!pending ? trailingIcon : undefined}
			className={cn(className, {
				'cursor-wait': pending,
			})}
			{...rest}
		>
			{pending && <Loader className="me-2 size-5" aria-hidden />}
			{children}
		</Button>
	);
};
