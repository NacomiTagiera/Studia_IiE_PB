import { type Artist } from '../artists/types';

export interface Song {
	id: number;
	title: string;
	genreId: number;
	songLength: number;
	releaseYear: number;
	viewCount: number;
	coverUrl: string;
	songUrl: string;
	artist?: Artist | null;
}

export interface LikedSongResponse {
	id: number;
	userId: string;
	songDto: Song;
	artist: Artist;
}

export interface HistoryItem {
	id: number;
	song: Song;
	timestamp: string;
}
