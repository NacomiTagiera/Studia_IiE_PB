'use server';

import { revalidatePath } from 'next/cache';

import { type FormState } from '@/types';

import { addSongToPlaylist, createPlaylist, deletePlaylist } from './data-access';
import { addSongToPlaylistSchema, createPlaylistSchema } from './schema';
import { type AddSongToPlaylist, type CreatePlaylist } from './types';

export const addSongToPlaylistAction = async ({ playlistId, songId }: AddSongToPlaylist) => {
	try {
		const result = addSongToPlaylistSchema.safeParse({ playlistId, songId });

		if (!result.success) {
			return {
				success: false,
				error: result.error.message,
			};
		}

		const res = await addSongToPlaylist(playlistId, songId);
		if (!res.ok) {
			return {
				success: false,
				error: 'Failed to add song to playlist',
			};
		}

		revalidatePath(`/playlists/${playlistId}`);

		return {
			success: true,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: 'Failed to add song to playlist',
		};
	}
};

interface CreatePlaylistResult extends FormState {
	playlistId?: number;
}

export const createPlaylistAction = async (playlist: CreatePlaylist): Promise<CreatePlaylistResult> => {
	try {
		const result = createPlaylistSchema.safeParse(playlist);

		if (!result.success) {
			return {
				status: 'error',
				message: result.error.message,
			};
		}

		const newPlaylist = await createPlaylist(result.data);
		console.log(newPlaylist);
		if (!newPlaylist)
			return {
				status: 'error',
				message: 'Failed to create playlist',
			};

		revalidatePath('/');

		return {
			status: 'success',
			message: 'Playlist created successfully',
			playlistId: newPlaylist.id,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'error',
			message: 'Failed to create playlist',
		};
	}
};

export const deletePlaylistAction = async (id: number) => {
	try {
		const res = await deletePlaylist(id);
		if (!res.ok) {
			return {
				success: false,
				error: 'Failed to delete playlist',
			};
		}

		return { success: true };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: 'Failed to delete playlist',
		};
	}
};
