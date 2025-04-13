'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { type Genre } from '../types';

interface Props {
	genres: Genre[];
}

export const GenreList = ({ genres }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre'));

	const handleClick = (genre: string) => {
		if (genre === selectedGenre) {
			setSelectedGenre(null);
			router.push('/');
		} else {
			setSelectedGenre(genre);
			router.push(`/?genre=${genre}`);
		}
	};

	return (
		<ScrollArea className="w-full max-w-7xl whitespace-nowrap">
			<div className="flex w-max space-x-2 p-1 pb-5">
				{genres.map((genre) => (
					<Button
						key={genre.id}
						size="sm"
						onClick={() => handleClick(genre.id)}
						className={cn(
							'rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
							selectedGenre === genre.id
								? '!bg-white !text-black hover:!bg-white/90 hover:!text-black'
								: 'bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white',
						)}
					>
						{genre.genreName}
					</Button>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
};
