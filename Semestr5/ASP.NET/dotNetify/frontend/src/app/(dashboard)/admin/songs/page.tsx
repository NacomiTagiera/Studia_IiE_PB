import { getArtists } from '@/features/artists/data-access';
import { getGenres } from '@/features/genres/data-access';
import { AdminSongsTable } from '@/features/songs/components/admin-songs-table';
import { CreateSongForm } from '@/features/songs/components/create-song-form';
import { getSongs } from '@/features/songs/data-access';

export default async function AdminSongsPage() {
	const [songs, artists, genres] = await Promise.all([getSongs(), getArtists(), getGenres()]);

	return (
		<div className="space-y-6 rounded-xl p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Manage Songs</h1>
				<CreateSongForm artists={artists} genres={genres} />
			</div>
			<AdminSongsTable songs={songs} />
		</div>
	);
}
