import { create } from 'zustand';

import { addSongToHistoryAction } from '@/features/songs/actions';
import { type Song } from '@/features/songs/types';

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	volume: number;
	progress: number;
	repeatMode: 'none' | 'track' | 'queue';
	isShuffled: boolean;
	originalQueue: Song[];

	initializeQueue: (songs: Song[]) => void;
	playPlaylist: (songs: Song[], startIndex?: number) => Promise<void>;
	setCurrentSong: (song: Song | null) => Promise<void>;
	playSong: (song: Song) => Promise<void>;
	pause: () => void;
	resume: () => void;
	playNext: () => Promise<void>;
	playPrevious: () => Promise<void>;
	setVolume: (volume: number) => void;
	setProgress: (progress: number) => void;
	toggleRepeatMode: () => void;
	toggleShuffle: () => void;
	addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	volume: 1,
	progress: 0,
	repeatMode: 'none',
	isShuffled: false,
	originalQueue: [],

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playPlaylist: async (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		if (!song) return;

		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});

		await addSongToHistoryAction(song);
	},

	setCurrentSong: async (song: Song | null) => {
		if (!song) return;

		const songIndex = get().queue.findIndex((s) => s.id === song.id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});

		await addSongToHistoryAction(song);
	},

	playSong: async (song: Song) => {
		set({ currentSong: song, isPlaying: true });
		await addSongToHistoryAction(song);
	},

	pause: () => {
		set({ isPlaying: false });
	},

	resume: () => {
		set({ isPlaying: true });
	},

	setVolume: (volume: number) => {
		set({ volume: Math.max(0, Math.min(1, volume)) });
	},

	setProgress: (progress: number) => {
		set({ progress });
	},

	toggleRepeatMode: () => {
		const modes: ('none' | 'track' | 'queue')[] = ['none', 'track', 'queue'];
		const currentIndex = modes.indexOf(get().repeatMode);
		const nextMode = modes[(currentIndex + 1) % modes.length];
		set({ repeatMode: nextMode });
	},

	toggleShuffle: () => {
		const { queue, isShuffled, originalQueue } = get();

		if (isShuffled) {
			set({ queue: [...originalQueue], isShuffled: false });
		} else {
			set({
				originalQueue: [...queue],
				queue: [...queue].sort(() => Math.random() - 0.5),
				isShuffled: true,
			});
		}
	},

	playNext: async () => {
		const { currentIndex, queue, repeatMode } = get();
		const nextIndex = currentIndex + 1;

		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			if (!nextSong) return;

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
			await addSongToHistoryAction(nextSong);
		} else if (repeatMode === 'queue') {
			const firstSong = queue[0];

			if (!firstSong) return;

			set({
				currentSong: firstSong,
				currentIndex: 0,
				isPlaying: true,
			});
			await addSongToHistoryAction(firstSong);
		} else if (repeatMode === 'track') {
			const currentSong = queue[currentIndex];

			if (!currentSong) return;

			set({
				currentSong: currentSong,
				isPlaying: true,
			});
			await addSongToHistoryAction(currentSong);
		} else {
			set({ isPlaying: false });
		}
	},

	playPrevious: async () => {
		const { currentIndex, queue, repeatMode } = get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			if (!prevSong) return;

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
			await addSongToHistoryAction(prevSong);
		} else if (repeatMode === 'queue') {
			const lastSong = queue[queue.length - 1];

			if (!lastSong) return;

			set({
				currentSong: lastSong,
				currentIndex: queue.length - 1,
				isPlaying: true,
			});
			await addSongToHistoryAction(lastSong);
		} else if (repeatMode === 'track') {
			const currentSong = queue[currentIndex];

			if (!currentSong) return;
			set({
				currentSong: currentSong,
				isPlaying: true,
			});
			await addSongToHistoryAction(currentSong);
		} else {
			set({ isPlaying: false });
		}
	},

	addToQueue: (song: Song) => {
		const { queue, isShuffled, originalQueue } = get();

		// Add to both queues if shuffle is enabled
		if (isShuffled) {
			set({
				queue: [...queue, song],
				originalQueue: [...originalQueue, song],
			});
		} else {
			set({ queue: [...queue, song] });
		}

		// If this is the first song, set it as current
		if (queue.length === 0) {
			set({
				currentSong: song,
				currentIndex: 0,
				isPlaying: true,
			});
		}
	},
}));
