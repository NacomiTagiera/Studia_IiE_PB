'use client';

import { useEffect, useRef } from 'react';

import { usePlayerStore } from '@/store/use-player-store';

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	useEffect(() => {
		if (isPlaying) {
			void audioRef.current?.play();
		} else {
			audioRef.current?.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			void playNext();
		};

		audio?.addEventListener('ended', handleEnded);

		return () => audio?.removeEventListener('ended', handleEnded);
	}, [playNext]);

	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		const isSongChange = prevSongRef.current !== currentSong?.songUrl;
		if (isSongChange) {
			audio.src = currentSong?.songUrl;
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.songUrl;

			if (isPlaying) {
				void audio.play();
			}
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};
