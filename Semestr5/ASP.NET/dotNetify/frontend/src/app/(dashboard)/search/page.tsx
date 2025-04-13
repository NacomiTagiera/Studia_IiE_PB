import { notFound } from 'next/navigation';

import { SongsGrid } from '@/features/songs/components/songs-grid';
import { getSongsByQuery } from '@/features/songs/data-access';
import { type SearchParams } from '@/types';

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
	const query = (await searchParams).query;

	if (!query || typeof query !== 'string') {
		notFound();
	}

	const songs = await getSongsByQuery(query);
	const songCount = songs.length;
	const songText = songCount === 1 ? 'song' : 'songs';

	return (
		<>
			<div className="mb-6 text-center">
				<h1 className="mb-2 text-2xl font-bold">Results for: {query}</h1>
				<p className="text-slate-400">
					Found {songCount} {songText} matching your search term.{' '}
					{songCount === 0 && 'Try different keywords to find what you are looking for.'}
				</p>
			</div>
			<SongsGrid songs={songs} />
		</>
	);
}
