import { API_URL } from '@/lib/constants';

import { type User } from './types';

export const getCurrentUser = async () => {
	// const token = (await cookies()).get('.AspNetCore.Identity.Application')?.value;

	// if (!token) {
	// 	return null;
	// }

	// const response = await fetch(`${API_URL}/api/Users/current`, {
	// 	credentials: 'include',
	// 	headers: {
	// 		accept: 'application/json',
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${token}`,
	// 	},
	// });

	return {
		id: '751185a6-057e-474f-a52e-6cf30933e578',
		username: 'Kuba Pawlak',
		email: 'test@o2.pl',
		role: 'admin',
	} as User;
};

export const getFavouriteGenres = async () => {
	const user = await getCurrentUser();
	if (!user) return [];

	const response = await fetch(`${API_URL}/user-top-genres/${user.id}?top=3`);

	if (!response.ok) {
		throw new Error('Failed to fetch favourite genres');
	}

	const data = (await response.json()) as { genre: string; listenCount: number }[];

	return data;
};

export const getUserListeningTime = async () => {
	const user = await getCurrentUser();
	if (!user) return 0;

	const response = await fetch(`${API_URL}/user-listening-time/${user.id}`);

	if (!response.ok) {
		throw new Error('Failed to fetch user listening time');
	}

	const data = (await response.json()) as { totalListeningTime: number };

	return data.totalListeningTime;
};
