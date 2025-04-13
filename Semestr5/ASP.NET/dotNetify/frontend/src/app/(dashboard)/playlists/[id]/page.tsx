import { notFound } from 'next/navigation';

import { getPlaylist } from '@/features/playlists/data-access';
import { SongsTable } from '@/features/songs/components/songs-table';

type Params = Promise<{ id: string }>;

export default async function PlaylistPage(props: { params: Params }) {
	const { id } = await props.params;
	const playlist = await getPlaylist(parseInt(id));

	if (!playlist) {
		return notFound();
	}

	return (
		<SongsTable
			id={playlist.id}
			songs={playlist.songs}
			title={playlist.playlistName}
			image={playlist.songs[0]?.coverUrl}
		/>
	);
}
