import { API_URL } from '@/lib/constants';

export const signIn = async (email: string, password: string) => {
	const response = await fetch(`${API_URL}/login?useCookies=true`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	return response;
};

export const signUp = async (email: string, password: string) => {
	const response = await fetch(`${API_URL}/signup`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	return response;
};
