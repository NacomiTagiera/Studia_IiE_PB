import { type z } from 'zod';

import { type Song } from '../songs/types';

import { type addSongToPlaylistSchema, type createPlaylistSchema } from './schema';

export interface Playlist {
	id: number;
	userId: string;
	playlistName: string;
	playlistDescription: string;
}

export interface PlaylistWithSongs extends Playlist {
	songs: Song[];
}

export type CreatePlaylist = z.infer<typeof createPlaylistSchema>;

export interface CreatePlaylistResponse extends CreatePlaylist {
	id: number;
}

export type AddSongToPlaylist = z.infer<typeof addSongToPlaylistSchema>;
