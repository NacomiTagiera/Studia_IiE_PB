'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume1 } from 'lucide-react';

import Image from 'next/image';

import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { usePlayerStore } from '@/store/use-player-store';

import { IconButton } from '../ui/icon-button';

export const PlaybackControls = () => {
	const { currentSong, isPlaying, pause, resume, playNext, playPrevious } = usePlayerStore();

	const [volume, setVolume] = useState(50);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector('audio');

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener('timeupdate', updateTime);
		audio.addEventListener('loadedmetadata', updateDuration);

		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('timeupdate', updateTime);
			audio.removeEventListener('loadedmetadata', updateDuration);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [currentSong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current && value[0] !== undefined) {
			audioRef.current.currentTime = value[0];
		}
	};

	const handlePlay = () => {
		if (currentSong) {
			if (isPlaying) {
				pause();
			} else {
				resume();
			}
		}
	};

	return (
		<div className="fixed bottom-0 h-20 w-full border-t border-slate-800 bg-slate-950 px-4 sm:h-24">
			<div className="mx-auto flex h-full max-w-[1800px] items-center justify-between">
				<div className="hidden w-[30%] min-w-[180px] items-center gap-4 sm:flex">
					{currentSong && (
						<>
							<Image
								src={currentSong.coverUrl}
								alt={currentSong.title}
								width={56}
								height={56}
								className="size-14 rounded-md object-cover"
							/>
							<div className="min-w-0 flex-1">
								<div className="cursor-pointer truncate font-medium hover:underline">{currentSong.title}</div>
							</div>
						</>
					)}
				</div>

				<div className="flex max-w-full flex-1 flex-col items-center gap-2 sm:max-w-[45%]">
					<div className="flex items-center gap-4 sm:gap-6">
						<IconButton icon={SkipBack} label="Previous" onClick={playPrevious} disabled={!currentSong} />
						<IconButton
							icon={isPlaying ? Pause : Play}
							label={isPlaying ? 'Pause' : 'Play'}
							onClick={handlePlay}
							disabled={!currentSong}
						/>
						<IconButton icon={SkipForward} label="Next" onClick={playNext} disabled={!currentSong} />
					</div>

					<div className="hidden w-full items-center gap-2 sm:flex">
						<div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className="w-full hover:cursor-grab active:cursor-grabbing"
							onValueChange={handleSeek}
						/>
						<div className="text-xs text-zinc-400">{formatTime(duration)}</div>
					</div>
				</div>
				<div className="hidden w-[30%] min-w-[180px] items-center justify-end gap-4 sm:flex">
					<div className="flex items-center gap-2">
						<IconButton
							icon={Volume1}
							label={volume === 0 ? 'Unmute' : 'Mute'}
							onClick={() => {
								setVolume(volume === 0 ? 50 : 0);
								if (audioRef.current) {
									audioRef.current.volume = volume === 0 ? 0.5 : 0;
								}
							}}
						/>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className="w-24 hover:cursor-grab active:cursor-grabbing"
							onValueChange={(value) => {
								setVolume(value[0] ?? 0);
								if (audioRef.current && value[0] !== undefined) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
