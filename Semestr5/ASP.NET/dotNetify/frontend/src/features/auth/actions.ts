'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { API_URL } from '@/lib/constants';
import { type FormState } from '@/types/forms';

import { signIn, signUp } from './data-access';
import { authSchema } from './schema';

export const signInAction = async (email: string, password: string): Promise<FormState> => {
	try {
		const result = authSchema.safeParse({ email, password });

		if (!result.success) {
			return {
				status: 'error',
				message: 'Correct validation errors and try again.',
				issues: result.error.flatten().fieldErrors,
			};
		}

		const response = await fetch(`${API_URL}/login?useCookies=true`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			return { status: 'error', message: response.statusText };
		}
		console.log(response.headers);

		const setCookie = response.headers.get('set-cookie');
		const cookieStore = await cookies();

		if (setCookie) {
			const cookieValue = setCookie.split(';')[0]?.split('=')[1];
			if (cookieValue) {
				cookieStore.set(process.env.TOKEN_COOKIE_NAME!, cookieValue, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
				});

				cookieStore.set('email', email, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
				});
			}
		}

		return { status: 'success', message: response.statusText };
	} catch (error) {
		return {
			status: 'error',
			message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
		};
	}
};

export const signUpAction = async (email: string, password: string): Promise<FormState> => {
	try {
		const result = authSchema.safeParse({ email, password });

		if (!result.success) {
			return { status: 'error', message: 'Validation failed', issues: result.error.flatten().fieldErrors };
		}

		const response = await signUp(email, password);

		if (!response.ok) {
			return { status: 'error', message: response.statusText };
		}

		await signIn(email, password);

		return { status: 'success', message: 'Signup successful' };
	} catch (error) {
		return { status: 'error', message: error instanceof Error ? error.message : 'Something went wrong' };
	}
};

export const logout = async () => {
	(await cookies()).delete(process.env.TOKEN_COOKIE_NAME!);
	redirect('/login');
};
