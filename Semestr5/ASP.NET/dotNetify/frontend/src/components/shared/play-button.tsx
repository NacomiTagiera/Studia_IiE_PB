'use client';

import { Pause, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type PlaylistWithSongs } from '@/features/playlists/types';
import { type Song } from '@/features/songs/types';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/use-player-store';

interface Props {
	song?: Song;
	playlist?: PlaylistWithSongs;
	className?: string;
}

export const PlayButton = ({ song, playlist, className }: Props) => {
	const { currentSong, isPlaying, playSong, pause, resume, playPlaylist } = usePlayerStore();
	const isCurrentSong = currentSong?.id === song?.id;

	const handlePlay = async () => {
		if (isCurrentSong) {
			if (isPlaying) {
				pause();
			} else {
				resume();
			}
		} else {
			if (song) await playSong(song);
			if (playlist) await playPlaylist(playlist.songs);
		}
	};

	return (
		<Button
			size="icon"
			aria-label="Play"
			onClick={handlePlay}
			className={cn(
				'rounded-full bg-brand opacity-0 transition-all hover:scale-105 hover:bg-brand-600',
				className,
			)}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className="size-5 fill-white text-white" />
			) : (
				<Play className="size-5 fill-white text-white" />
			)}
		</Button>
	);
};
