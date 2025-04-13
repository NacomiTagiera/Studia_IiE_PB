'use client';

import { type FormEvent, useState } from 'react';

import Link from 'next/link';

import { ActionButton } from '@/components/shared/action-button';
import { FormField } from '@/components/shared/form-field';
import { useToast } from '@/hooks/use-toast';

import { signInAction } from '../actions';

export const LoginForm = () => {
	const [issues, setIssues] = useState<Record<string, string[]>>({});
	const { toast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const email = (event.currentTarget.email as HTMLInputElement).value;
		const password = (event.currentTarget.password as HTMLInputElement).value;

		const result = await signInAction(email, password);
		console.log(result);

		if (result.status === 'error') {
			toast({ title: 'Login failed', description: result.message, variant: 'destructive' });
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
					id="email"
					name="email"
					type="email"
					inputMode="email"
					autoComplete="email"
					placeholder="me@example.com"
					required
					error={issues?.email?.[0]}
				/>
				<FormField
					label="Password"
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					error={issues?.password?.[0]}
				/>
				<ActionButton className="w-full">Login</ActionButton>
			</div>
			<div className="text-center text-sm">
				Don&apos;t have an account?{' '}
				<Link href="/register" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</form>
	);
};
