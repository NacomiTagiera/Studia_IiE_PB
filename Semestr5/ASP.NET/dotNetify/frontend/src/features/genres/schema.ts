import { z } from 'zod';

export const genreSchema = z.object({
	genreName: z
		.string()
		.trim()
		.min(1, 'Genre name is required')
		.max(20, 'Genre name must be less than 20 characters')
});
