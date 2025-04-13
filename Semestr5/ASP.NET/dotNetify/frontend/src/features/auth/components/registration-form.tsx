'use client';

import { type FormEvent, useState } from 'react';

import Link from 'next/link';

import { ActionButton } from '@/components/shared/action-button';
import { FormField } from '@/components/shared/form-field';
import { useToast } from '@/hooks/use-toast';

import { signUpAction } from '../actions';

export const RegistrationForm = () => {
	const [issues, setIssues] = useState<Record<string, string[]>>({});
	const { toast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const email = (event.currentTarget.email as HTMLInputElement).value;
		const password = (event.currentTarget.password as HTMLInputElement).value;

		const result = await signUpAction(email, password);

		if (result.status === 'error') {
			toast({ title: 'Registration failed', description: result.message, variant: 'destructive' });
			if (result.issues) {
				setIssues(result.issues);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-6">
			<div className="grid gap-6">
				<FormField
					label="Email"
					name="email"
					type="email"
					inputMode="email"
					placeholder="me@example.com"
					required
					autoComplete="email"
					error={issues?.email?.[0]}
				/>
				<FormField
					label="Password"
					name="password"
					type="password"
					required
					autoComplete="new-password"
					error={issues?.password?.[0]}
				/>
				<ActionButton className="w-full">Sign up</ActionButton>
			</div>
			<div className="text-center text-sm">
				Already have an account?{' '}
				<Link href="/login" className="underline underline-offset-4">
					Sign in
				</Link>
			</div>
		</form>
	);
};
