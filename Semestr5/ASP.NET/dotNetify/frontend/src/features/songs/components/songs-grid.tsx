import { Grid } from '@/components/shared/grid';
import { getUserPlaylists } from '@/features/playlists/data-access';

import { type Song } from '../types';

import { SongCard } from './song-card';

interface Props {
	songs: Song[];
}

export const SongsGrid = async ({ songs }: Props) => {
	const playlists = await getUserPlaylists();

	return (
		<Grid as="ul">
			{songs.map((song) => (
				<SongCard key={song.id} song={song} playlists={playlists} />
			))}
		</Grid>
	);
};
