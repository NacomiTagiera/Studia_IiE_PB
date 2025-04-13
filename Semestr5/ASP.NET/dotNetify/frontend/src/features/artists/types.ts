import { type Song } from '../songs/types';

export interface Artist {
	id: number;
	nickname: string;
	imageUrl: string;
	songs?: Song[];
}

export interface LikedArtistResponse {
	id: number;
	artistId: number;
	nickname: string;
	imageUrl: string;
}

export interface SongArtistResponse {
	id: number;
	songId: number;
	song: {
		id: number;
		title: string;
		genreId: number;
		genre: null;
		songLength: number;
		releaseYear: number;
		viewCount: number;
		coverUrl: string;
		songUrl: string;
	};
	artistId: number;
	artist: {
		id: number;
		nickname: string;
		imageUrl: string;
	};
}
