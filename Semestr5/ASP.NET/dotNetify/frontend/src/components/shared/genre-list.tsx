'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const genres = [
	'All',
	'Hip-Hop',
	'Pop',
	'Rock',
	'R&B',
	'Latin',
	'Electronic',
	'Jazz',
	'Classical',
	'Metal',
	'Country',
	'Folk',
	'Blues',
	'Reggae',
	'Soul',
	'Indie',
];

export const GenreList = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');

	const handleClick = (genre: string) => {
		setSelectedGenre(genre);
		if (genre === 'All') {
			router.push('/');
		} else {
			router.push(`/?genre=${genre}`);
		}
	};

	return (
		<ScrollArea className="w-full max-w-7xl whitespace-nowrap">
			<div className="flex w-max space-x-2 p-1 pb-5">
				{genres.map((genre) => (
					<Button
						key={genre}
						variant="ghost"
						size="sm"
						onClick={() => handleClick(genre)}
						className={cn(
							'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
							selectedGenre === genre
								? 'bg-white text-black hover:bg-white/90 hover:text-black'
								: 'bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white',
						)}
					>
						{genre}
					</Button>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
};
