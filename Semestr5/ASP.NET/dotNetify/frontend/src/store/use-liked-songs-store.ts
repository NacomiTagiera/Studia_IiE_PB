import { create } from 'zustand';

interface LikedSongsStore {
	likedSongIds: Set<number>;
	setLikedSongIds: (ids: Set<number>) => void;
	addLikedSong: (id: number) => void;
	removeLikedSong: (id: number) => void;
}

export const useLikedSongsStore = create<LikedSongsStore>((set) => ({
	likedSongIds: new Set(),
	setLikedSongIds: (ids) => set({ likedSongIds: ids }),
	addLikedSong: (id) =>
		set((state) => ({
			likedSongIds: new Set([...state.likedSongIds, id]),
		})),
	removeLikedSong: (id) =>
		set((state) => {
			const newIds = new Set(state.likedSongIds);
			newIds.delete(id);
			return { likedSongIds: newIds };
		}),
}));
