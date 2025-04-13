'use client';

import { useEffect } from 'react';
import { Heart, ListMusic, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addSongToPlaylistAction } from '@/features/playlists/actions';
import { type Playlist } from '@/features/playlists/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLikedSongsStore } from '@/store/use-liked-songs-store';

import { likeSongAction, removeLikedSongAction } from '../actions';
import { getLikedSongIds } from '../data-access';
import { type Song } from '../types';

interface SongMenuProps {
	song: Song;
	playlists: Playlist[] | null;
	className?: string;
}

export const SongMenu = ({ song, playlists, className }: SongMenuProps) => {
	const { toast } = useToast();
	const { likedSongIds, addLikedSong, removeLikedSong } = useLikedSongsStore();

	useEffect(() => {
		const initializeLikedSongs = async () => {
			const ids = await getLikedSongIds();
			useLikedSongsStore.setState({ likedSongIds: ids });
		};

		if (likedSongIds.size === 0) {
			void initializeLikedSongs();
		}
	}, [likedSongIds.size]);

	const isLiked = likedSongIds.has(song.id);

	const handleLike = async () => {
		if (isLiked) {
			const result = await removeLikedSongAction(song.id);
			if (result.success) {
				removeLikedSong(song.id);
				toast({ title: 'Success!', description: result.message, variant: 'success' });
			}
		} else {
			const result = await likeSongAction(song.id);
			if (result.success) {
				addLikedSong(song.id);
				toast({ title: 'Success!', description: result.message, variant: 'success' });
			}
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					className={cn(
						'rounded-full bg-brand opacity-0 transition-all hover:scale-105 hover:bg-brand-600',
						className,
					)}
				>
					<span className="sr-only">Open menu for {song.title}</span>
					<MoreVertical className="size-4 fill-white text-white" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 border-slate-800 bg-slate-900 text-slate-200" align="start">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className="hover:bg-slate-800">
						<ListMusic className="mr-2 size-4" aria-hidden="true" />
						<span>Add to playlist</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent className="border-slate-800 bg-slate-900 text-slate-200">
							{playlists?.map((playlist) => (
								<DropdownMenuItem
									key={playlist.id}
									className="hover:bg-slate-800"
									onClick={async () => {
										const result = await addSongToPlaylistAction({
											playlistId: playlist.id,
											songId: song.id,
										});
										if (result.success) {
											toast({
												title: 'Success!',
												description: 'Song has been added to playlist',
												variant: 'success',
											});
										} else {
											toast({
												title: 'Oops! An error occurred',
												description: result.error,
												variant: 'destructive',
											});
										}
									}}
								>
									{playlist.playlistName}
								</DropdownMenuItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuItem onClick={handleLike}>
					<Heart className="mr-2 size-4" />
					<span>{isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="hover:bg-slate-800">
					<ListMusic className="mr-2 size-4" aria-hidden="true" />
					<span>Add to queue</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
