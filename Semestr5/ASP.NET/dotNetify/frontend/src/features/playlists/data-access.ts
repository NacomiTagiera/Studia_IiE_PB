import { API_URL } from '@/lib/constants';

import { getCurrentUser } from '../users/data-access';

import type { CreatePlaylist, CreatePlaylistResponse, Playlist, PlaylistWithSongs } from './types';

export const getUserPlaylists = async () => {
	const user = await getCurrentUser();
	if (!user) return [];

	const res = await fetch(`${API_URL}/api/Playlist/${user.id}`);
	const data = (await res.json()) as Playlist[];
	return data;
};

export const getPlaylist = async (id: number) => {
	const res = await fetch(`${API_URL}/api/Playlist/playlist/${id}`);
	const data = (await res.json()) as PlaylistWithSongs;
	return data;
};

export const createPlaylist = async (playlist: CreatePlaylist) => {
	const user = await getCurrentUser();
	if (!user) return;

	const res = await fetch(`${API_URL}/api/Playlist`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...playlist,
			userId: user.id,
		}),
	});

	console.log(res);

	const data = (await res.json()) as CreatePlaylistResponse;
	return data;
};

export const deletePlaylist = async (id: number) => {
	const res = await fetch(`${API_URL}/api/Playlist/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	return res;
};

export const addSongToPlaylist = async (playlistId: number, songId: number) => {
	const res = await fetch(`${API_URL}/api/Playlist/${playlistId}/songs`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			songId,
		}),
	});

	console.log(res);

	return res;
};
