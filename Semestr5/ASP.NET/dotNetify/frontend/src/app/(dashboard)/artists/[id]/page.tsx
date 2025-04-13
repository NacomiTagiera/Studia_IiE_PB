import { notFound } from 'next/navigation';

import { getArtistById } from '@/features/artists/data-access';
import { SongsTable } from '@/features/songs/components/songs-table';

type Params = Promise<{ id: string }>;

export default async function ArtistPage(props: { params: Params }) {
	const { id } = await props.params;
	const artist = await getArtistById(parseInt(id));

	if (!artist) {
		return notFound();
	}

	return <SongsTable songs={artist.songs} title={artist.nickname} image={artist.imageUrl} type="artist" />;
}
