import { z } from 'zod';

export const createSongSchema = z.object({
	title: z.string().trim().min(1).max(100),
	songUrl: z.string().url(),
	coverUrl: z.string().url(),
	releaseYear: z.number().min(1900).max(new Date().getFullYear()),
	songLength: z.number().min(1),
	genreId: z.number().positive(),
	artistId: z.number().positive(),
});
