import { LikedArtists } from '@/features/artists/components/liked-artists';
import { GenreList } from '@/features/genres/components/genre-list';
import { getGenres } from '@/features/genres/data-access';
import { LikedSongs } from '@/features/songs/components/liked-songs';
import { SongsGrid } from '@/features/songs/components/songs-grid';
import { getSongsByGenre } from '@/features/songs/data-access';
import { type SearchParams } from '@/types';

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
	const genre = (await searchParams).genre;
	const genres = await getGenres();

	if (genre) {
		const songs = await getSongsByGenre(Number(genre as string));

		return (
			<div className="h-full space-y-6 rounded-xl p-6">
				<GenreList genres={genres} />
				<SongsGrid songs={songs} />
			</div>
		);
	}

	return (
		<div className="space-y-6 rounded-xl p-6">
			<GenreList genres={genres} />
			<LikedSongs />
			<LikedArtists />
		</div>
	);
}
