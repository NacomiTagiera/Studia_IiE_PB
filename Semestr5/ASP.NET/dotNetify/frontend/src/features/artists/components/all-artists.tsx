'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { likeArtistAction, removeLikedArtistAction } from '../actions';
import { type Artist } from '../types';

interface Props {
	artists: Artist[];
	likedArtistIds?: number[];
	type?: 'artist' | 'liked';
}

export const AllArtists = ({ artists, likedArtistIds = [], type = 'artist' }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleLikeToggle = async (artistId: number, isLiked: boolean) => {
		setIsLoading(true);

		const action = isLiked ? removeLikedArtistAction : likeArtistAction;
		const result = await action(artistId);

		if (result.success) {
			toast({
				title: 'Success',
				description: result.message,
			});
			router.refresh();
		} else {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			});
		}

		setIsLoading(false);
	};

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
			{artists.map((artist) => {
				const isLiked = likedArtistIds.includes(artist.id);

				return (
					<div
						key={artist.id}
						className="group flex flex-col items-center gap-3 rounded-xl bg-slate-800/50 p-4 transition-colors hover:bg-slate-800/70"
					>
						<div className="relative aspect-square w-full overflow-hidden rounded-lg">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={artist.imageUrl}
								alt={artist.nickname}
								className="h-full w-full object-cover transition-transform group-hover:scale-105"
							/>
						</div>
						<div className="flex w-full items-center justify-between">
							<span className="text-base font-medium text-white">{artist.nickname}</span>
							{type === 'artist' && (
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-neutral-400 hover:text-white"
									disabled={isLoading}
									onClick={() => handleLikeToggle(artist.id, isLiked)}
								>
									<Heart className={isLiked ? 'fill-red-500 text-red-500' : ''} aria-hidden />
									<span className="sr-only">{isLiked ? 'Remove from liked' : 'Add to liked'}</span>
								</Button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
