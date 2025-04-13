import { PlayButton } from '@/components/shared/play-button';
import { BlurredImage } from '@/components/ui/blurred-image';
import { type Playlist } from '@/features/playlists/types';

import { type Song } from '../types';

import { SongMenu } from './song-menu';

interface Props {
	song: Song;
	playlists: Playlist[] | null;
}

export const SongCard = ({ song, playlists }: Props) => {
	return (
		<li key={song.id} className="group space-y-4 rounded-md p-4 transition-colors hover:bg-slate-800">
			<div className="relative aspect-square">
				<BlurredImage
					src={song.coverUrl}
					alt={song.title}
					className="h-full w-full rounded-md object-cover"
					width={300}
					height={300}
				/>
				<div className="absolute bottom-0 flex w-full justify-between px-2">
					<SongMenu
						song={song}
						playlists={playlists}
						className="translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
					/>
					<PlayButton
						song={song}
						className="translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
					/>
				</div>
			</div>
			<div className="space-y-1 text-sm">
				<h3 className="line-clamp-1 font-semibold capitalize">{song.title}</h3>
				<p className="line-clamp-2 text-neutral-400">{song.artist?.nickname}</p>
			</div>
		</li>
	);
};
