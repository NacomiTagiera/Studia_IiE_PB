'use server';

import { addArtist, deleteArtist, likeArtist, removeLikedArtist, updateArtist } from './data-access';
import { createArtistSchema } from './schema';
import { type Artist } from './types';

export const likeArtistAction = async (id: number) => {
	try {
		const res = await likeArtist(id);
		if (!res?.ok) {
			return { success: false, error: 'Failed to like artist' };
		}

		return { success: true, message: 'Artist liked successfully' };
	} catch (error) {
		console.error('Failed to like artist:', error);
		return { success: false, error: 'Failed to like artist' };
	}
};

export const removeLikedArtistAction = async (id: number) => {
	try {
		await removeLikedArtist(id);
		return { success: true, message: 'Artist has been removed from your Liked Artists' };
	} catch (error) {
		console.error('Failed to remove liked artist:', error);
		return { success: false, error: 'Failed to remove liked artist' };
	}
};

export const createArtistAction = async (artist: Omit<Artist, 'id'>) => {
	try {
		const result = createArtistSchema.safeParse(artist);
		if (!result.success) {
			return { success: false, error: result.error.message };
		}

		const res = await addArtist(result.data);
		if (!res?.ok) {
			return { success: false, error: 'Failed to create artist' };
		}

		return { success: true, message: 'Artist created successfully' };
	} catch (error) {
		console.error('Failed to create artist:', error);
		return { success: false, error: 'Failed to create artist' };
	}
};

export const deleteArtistAction = async (id: number) => {
	try {
		const response = await deleteArtist(id);

		if (!response?.ok) {
			return { success: false, error: 'Failed to delete artist' };
		}

		return { success: true, message: 'Artist deleted successfully' };
	} catch (error) {
		console.error('Failed to delete artist:', error);
		return { success: false, error: 'Failed to delete artist' };
	}
};

export const updateArtistAction = async (id: number, artist: Omit<Artist, 'id'>) => {
	try {
		const result = createArtistSchema.safeParse(artist);
		if (!result.success) {
			return { success: false, error: result.error.message };
		}

		const res = await updateArtist(id, result.data);
		if (!res?.ok) {
			return { success: false, error: 'Failed to update artist' };
		}

		return { success: true, message: 'Artist updated successfully' };
	} catch (error) {
		console.error('Failed to update artist:', error);
		return { success: false, error: 'Failed to update artist' };
	}
};
