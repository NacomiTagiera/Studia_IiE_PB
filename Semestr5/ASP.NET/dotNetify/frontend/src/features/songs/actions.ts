'use server';

import { addSongToHistory, createSong, deleteSong, editSong, likeSong, removeLikedSong } from './data-access';
import { type Song } from './types';

export const addSongToHistoryAction = async (song: Song) => {
	try {
		await addSongToHistory(song.id);

		const updatedSong: Song = {
			...song,
			viewCount: song.viewCount + 1,
		};

		await editSong(updatedSong);

		return { success: true };
	} catch (error) {
		console.error('Failed to update song history:', error);
		return { success: false, error: 'Failed to update song history' };
	}
};

export const editSongAction = async (song: Song) => {
	await editSong(song);
};

export const likeSongAction = async (songId: number) => {
	try {
		const res = await likeSong(songId);
		if (!res?.ok) {
			return { success: false, error: 'Failed to like song' };
		}

		return { success: true, message: 'Song liked successfully' };
	} catch (error) {
		console.error('Failed to like song:', error);
		return { success: false, error: 'Failed to like song' };
	}
};

export const removeLikedSongAction = async (songId: number) => {
	try {
		await removeLikedSong(songId);
		return { success: true, message: 'Song has been removed from your Liked Songs' };
	} catch (error) {
		console.error('Failed to remove liked song:', error);
		return { success: false, error: 'Failed to remove liked song' };
	}
};

export const deleteSongAction = async (songId: number) => {
	try {
		const response = await deleteSong(songId);
		if (!response?.ok) {
			return { success: false, error: 'Failed to delete song' };
		}

		return { success: true, message: 'Song deleted successfully' };
	} catch (error) {
		console.error('Failed to delete song:', error);
		return { success: false, error: 'Failed to delete song' };
	}
};

export type CreateSong = Omit<Song, 'id' | 'viewCount' | 'artist'> & { artistId: number };

export const createSongAction = async (song: CreateSong) => {
	try {
		const response = await createSong(song);
		if (!response?.ok) {
			return { success: false, error: response.statusText };
		}

		return { success: true, message: 'Song created successfully' };
	} catch (error) {
		console.error('Failed to create song:', error);
		return { success: false, error: error instanceof Error ? error.message : 'Failed to create song' };
	}
};
