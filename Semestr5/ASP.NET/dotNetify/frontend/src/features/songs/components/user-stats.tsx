'use client';

import { useMemo } from 'react';
import { Clock, Disc3, Music2, User } from 'lucide-react';

import { formatListeningTime } from '@/lib/utils';

import { type HistoryItem } from '../types';

interface StatsCardProps {
	icon: React.ReactNode;
	title: string;
	value: React.ReactNode;
}

const StatsCard = ({ icon, title, value }: StatsCardProps) => (
	<div className="flex flex-1 items-center gap-4 rounded-xl bg-slate-800/50 p-6">
		<div className="rounded-lg bg-brand/10 p-2 text-brand">{icon}</div>
		<div>
			<p className="text-sm text-neutral-400">{title}</p>
			<div className="mt-1 text-xl font-semibold text-white">{value}</div>
		</div>
	</div>
);

interface Props {
	history: HistoryItem[];
	genres: Array<{ genre: string; listenCount: number }>;
	listeningTime: number;
}

export const UserStats = ({ history, genres, listeningTime }: Props) => {
	const { topArtist, topSong } = useMemo(() => {
		const artistCounts: Record<string, { count: number; name: string }> = {};
		const songCounts: Record<number, { count: number; title: string; artist?: string }> = {};

		history.forEach(({ song }) => {
			// Count artists
			if (song.artist?.nickname) {
				const name = song.artist.nickname;
				if (!artistCounts[name]) {
					artistCounts[name] = { count: 0, name };
				}
				artistCounts[name].count++;
			}

			// Count songs
			if (!songCounts[song.id]) {
				songCounts[song.id] = {
					count: 0,
					title: song.title,
					artist: song.artist?.nickname,
				};
			}
			songCounts[song.id]!.count++;
		});

		const topArtist = Object.values(artistCounts).sort((a, b) => b.count - a.count)[0]?.name || 'No data';
		const topSongData = Object.values(songCounts).sort((a, b) => b.count - a.count)[0];

		return {
			topArtist,
			topSong: topSongData
				? {
						title: topSongData.title,
						artist: topSongData.artist,
						plays: topSongData.count,
					}
				: null,
		};
	}, [history]);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatsCard
				icon={<Disc3 className="size-5" />}
				title="Top Genres"
				value={
					<div className="flex flex-col gap-1">
						{genres.map(({ genre, listenCount }, index) => (
							<div key={genre} className="flex items-center gap-2">
								<span className="text-sm font-normal text-neutral-400">#{index + 1}</span>
								<span>{genre}</span>
								<span className="text-sm font-normal text-neutral-400">({listenCount} plays)</span>
							</div>
						))}
					</div>
				}
			/>
			<StatsCard
				icon={<Music2 className="size-5" />}
				title="Most Played Song"
				value={
					topSong ? (
						<div className="flex flex-col">
							<span>{topSong.title}</span>
							{topSong.artist && (
								<span className="text-sm font-normal text-neutral-400">{topSong.artist}</span>
							)}
							<span className="text-sm font-normal text-neutral-400">
								{topSong.plays} {topSong.plays === 1 ? 'play' : 'plays'}
							</span>
						</div>
					) : (
						'No data'
					)
				}
			/>
			<StatsCard
				icon={<Clock className="size-5" />}
				title="Listening Time"
				value={formatListeningTime(listeningTime)}
			/>
			<StatsCard icon={<User className="size-5" />} title="Most Played Artist" value={topArtist} />
		</div>
	);
};
