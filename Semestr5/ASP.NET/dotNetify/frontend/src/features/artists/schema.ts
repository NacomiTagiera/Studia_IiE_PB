import { z } from 'zod';

export const createArtistSchema = z.object({
	nickname: z.string().trim().min(3).max(50),
	imageUrl: z.string().url(),
});
