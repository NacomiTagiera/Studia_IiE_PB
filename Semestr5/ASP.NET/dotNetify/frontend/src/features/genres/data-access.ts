import { API_URL } from '@/lib/constants';

import { type Genre } from './types';

export const getGenres = async () => {
	const response = await fetch(`${API_URL}/api/Genre`);
	return (await response.json()) as Genre[];
};
