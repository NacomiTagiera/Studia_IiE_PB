import { ArtistsTable } from '@/features/artists/components/artists-table';
import { CreateArtistForm } from '@/features/artists/components/create-artist-form';
import { getArtists } from '@/features/artists/data-access';

export default async function AdminArtistsPage() {
	const artists = await getArtists();

	return (
		<div className="space-y-6 rounded-xl p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Manage Artists</h1>
				<CreateArtistForm />
			</div>
			<ArtistsTable artists={artists} />
		</div>
	);
}
