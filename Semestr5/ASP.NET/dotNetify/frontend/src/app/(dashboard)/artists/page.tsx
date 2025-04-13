import { AllArtists } from '@/features/artists/components/all-artists';
import { getArtists, getLikedArtists } from '@/features/artists/data-access';

export default async function ArtistsPage() {
	const [artists, likedArtists] = await Promise.all([getArtists(), getLikedArtists()]);
	const likedArtistIds = likedArtists.map((la) => la.artist.id);

	return (
		<div className="space-y-6 rounded-xl p-6">
			<h1 className="text-2xl font-bold">Artists</h1>
			<AllArtists artists={artists} likedArtistIds={likedArtistIds} type="artist" />
		</div>
	);
}
