import { z } from 'zod';

export const createPlaylistSchema = z.object({
	playlistName: z.string().trim().min(1).max(50),
	playlistDescription: z.string().trim().min(1).max(100),
});

export const addSongToPlaylistSchema = z.object({
	playlistId: z.number().min(1),
	songId: z.number().min(1),
});
