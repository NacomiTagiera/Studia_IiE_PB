export interface Song {
	id: number;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Playlist {
	id: string;
	title: string;
	author: string;
	type: 'playlist' | 'artist';
	image: string;
}

export interface User {
	id: string;
	fullName: string;
	imageUrl: string;
}

export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export interface FormState {
	status: 'idle' | 'success' | 'error';
	message: string;
	issues?: Record<string, string[]>;
}
