import { API_URL } from '@/lib/constants';

import { getArtistById } from '../artists/data-access';
import { getCurrentUser } from '../users/data-access';

import { type CreateSong } from './actions';
import { type LikedSongResponse, type Song } from './types';

export const getSongs = async () => {
	const response = await fetch(`${API_URL}/api/Songs`);
	const data = (await response.json()) as Song[];
	return data;
};

export const getSongsByQuery = async (query: string) => {
	const response = await fetch(`${API_URL}/api/Songs?query=${query}`);
	const data = (await response.json()) as Song[];
	return data;
};

export const getSongsByGenre = async (genreId: number) => {
	const response = await fetch(`${API_URL}/api/Songs?genreId=${genreId}`);
	const data = (await response.json()) as Song[];
	return data;
};

export const getLikedSongs = async () => {
	const user = await getCurrentUser();
	if (!user) return [];

	const response = await fetch(`${API_URL}/api/LikedSongs/user/${user.id}`);
	const data = (await response.json()) as LikedSongResponse[];

	return data.map((likedSong) => ({
		id: likedSong.id,
		song: {
			...likedSong.songDto,
			artist: likedSong.artist,
		} satisfies Song,
	}));
};

export const getSongById = async (songId: number) => {
	const response = await fetch(`${API_URL}/api/Songs/${songId}`, {
		cache: 'no-store',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch song');
	}

	const data = (await response.json()) as Song;
	return data;
};

export const addSongToHistory = async (songId: number) => {
	const user = await getCurrentUser();

	if (!user) return;

	const response = await fetch(`${API_URL}/api/UserHistory`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ songId, userId: user.id }),
	});

	if (!response.ok) {
		console.error('Failed to add song to history', response);
	}

	return response;
};

export const editSong = async (song: Song) => {
	const response = await fetch(`${API_URL}/api/Songs`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(song),
	});

	if (!response.ok) {
		throw new Error('Failed to update song');
	}

	return response;
};

export const likeSong = async (songId: number) => {
	const user = await getCurrentUser();
	if (!user) return;

	const response = await fetch(`${API_URL}/api/LikedSongs`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: user.id,
			songId,
		}),
	});

	return response;
};

export const removeLikedSong = async (songId: number) => {
	const res = await fetch(`${API_URL}/api/LikedSongs/${songId}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	return res;
};

export const getLikedSongIds = async () => {
	const user = await getCurrentUser();
	if (!user) return new Set<number>();

	const likedSongs = await getLikedSongs();
	return new Set(likedSongs.map(({ song }) => song.id));
};

interface HistoryResponse {
	id: number;
	user: {
		id: string;
		userName: string;
	};
	song: {
		id: number;
		title: string;
		songLength: number;
		genre: string;
		artists: Array<{
			id: number;
			nickname: string;
			imageUrl: string;
		}>;
	};
	timestamp: string;
}

interface HistoryItem {
	id: number;
	song: Song;
	timestamp: string;
}

export const getUserHistory = async () => {
	const user = await getCurrentUser();
	if (!user) return [];

	const response = await fetch(`${API_URL}/api/UserHistory/byUser?userId=${user.id}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch user history');
	}

	const data = (await response.json()) as HistoryResponse[];

	return data.map(
		(item): HistoryItem => ({
			id: item.id,
			timestamp: item.timestamp,
			song: {
				id: item.song.id,
				title: item.song.title,
				songLength: item.song.songLength,
				genreId: 0, // Since it's not in the response
				releaseYear: 0, // Since it's not in the response
				viewCount: 0, // Since it's not in the response
				coverUrl: item.song.artists[0]?.imageUrl || '',
				songUrl: '', // Since it's not in the response
				artist: item.song.artists[0]
					? {
							id: item.song.artists[0].id,
							nickname: item.song.artists[0].nickname,
							imageUrl: item.song.artists[0].imageUrl,
						}
					: null,
			},
		}),
	);
};

export const createSong = async (song: CreateSong) => {
	const artist = await getArtistById(song.artistId);

	const response = await fetch(`${API_URL}/api/Songs`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			title: song.title,
			songUrl: song.songUrl,
			coverUrl: song.coverUrl,
			releaseYear: song.releaseYear,
			songLength: song.songLength,
			genreId: song.genreId,
			viewCount: 0,
			artist: {
				id: artist?.id,
				nickname: artist?.nickname,
				imageUrl: artist?.imageUrl,
			},
		}),
	});

	return response;
};

export const deleteSong = async (id: number) => {
	const response = await fetch(`${API_URL}/api/Songs/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	return response;
};
