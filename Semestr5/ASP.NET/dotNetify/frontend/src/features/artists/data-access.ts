import { API_URL } from '@/lib/constants';

import { getCurrentUser } from '../users/data-access';

import { type Artist, type LikedArtistResponse, type SongArtistResponse } from './types';

export const getArtists = async () => {
	const response = await fetch(`${API_URL}/api/Artist`);
	const data = (await response.json()) as Artist[];
	return data.map((artist) => ({
		id: artist.id,
		nickname: artist.nickname,
		imageUrl: artist.imageUrl ?? '/album.jpg',
	}));
};

export const getLikedArtists = async () => {
	const user = await getCurrentUser();
	if (!user) return [];

	const response = await fetch(`${API_URL}/api/LikedArtists/user/${user.id}`);
	const data = (await response.json()) as LikedArtistResponse[];
	return data.map((artist) => ({
		id: artist.id,
		artist: {
			id: artist.artistId,
			nickname: artist.nickname,
			imageUrl: artist.imageUrl,
		},
	}));
};

export const getArtistById = async (id: number) => {
	const response = await fetch(`${API_URL}/api/SongArtist/artist/${id}`);
	const data = (await response.json()) as SongArtistResponse[];

	if (!data.length || !data[0]?.artist) return null;

	const { artist, artistId } = data[0];

	return {
		id: artistId,
		nickname: artist.nickname,
		imageUrl: artist.imageUrl ?? '',
		songs: data.map(({ song }) => ({
			id: song.id,
			title: song.title,
			genreId: song.genreId,
			songLength: song.songLength,
			releaseYear: song.releaseYear,
			viewCount: song.viewCount,
			coverUrl: song.coverUrl,
			songUrl: song.songUrl,
		})),
	} satisfies Artist;
};

export const likeArtist = async (artistId: number) => {
	const user = await getCurrentUser();
	if (!user) return;

	const response = await fetch(`${API_URL}/api/LikedArtists`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			userId: user.id,
			artistId,
		}),
	});

	return response;
};

export const removeLikedArtist = async (id: number) => {
	const res = await fetch(`${API_URL}/api/LikedArtists/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	return res;
};

export const addArtist = async (artist: Omit<Artist, 'id'>) => {
	const response = await fetch(`${API_URL}/api/Artist`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-type': 'application/json',
		},
		body: JSON.stringify(artist),
	});

	return response;
};

export const deleteArtist = async (id: number) => {
	const response = await fetch(`${API_URL}/api/Artist/${id}`, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-type': 'application/json',
		},
	});

	return response;
};

export const updateArtist = async (id: number, artist: Omit<Artist, 'id'>) => {
	const response = await fetch(`${API_URL}/api/Artist/${id}`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			accept: 'application/json',
			'Content-type': 'application/json',
		},
		body: JSON.stringify(artist),
	});

	return response;
};
