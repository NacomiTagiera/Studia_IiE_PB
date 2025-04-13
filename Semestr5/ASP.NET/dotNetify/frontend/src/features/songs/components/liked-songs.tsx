import { getLikedSongs } from '../data-access';

import { SongsGrid } from './songs-grid';

export const LikedSongs = async () => {
	const likedSongs = await getLikedSongs();

	if (!likedSongs.length) {
		return null;
	}

	return (
		<>
			<h2 className="mb-6 text-2xl font-bold">Your Favourite Songs</h2>
			<SongsGrid songs={likedSongs.map(({ song }) => song)} />
		</>
	);
};
