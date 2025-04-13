'use client';

import { type FormEvent, useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Artist } from '@/features/artists/types';
import { type Genre } from '@/features/genres/types';
import { useToast } from '@/hooks/use-toast';

interface Props {
	artists: Artist[];
	genres: Genre[];
}

export const CreateSongForm = ({ artists, genres }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		// const songData = {
		// 	title: (e.currentTarget.title as unknown as HTMLInputElement).value,
		// 	songUrl: (e.currentTarget.songUrl as HTMLInputElement).value,
		// 	coverUrl: (e.currentTarget.coverUrl as HTMLInputElement).value,
		// 	releaseYear: Number((e.currentTarget.releaseYear as HTMLInputElement).value),
		// 	songLength: Number((e.currentTarget.songLength as HTMLInputElement).value),
		// 	genreId: Number((e.currentTarget.genreId as HTMLInputElement).value),
		// 	artistId: Number((e.currentTarget.artistId as HTMLInputElement).value),
		// };

		// Create optimistic song and add to UI immediately

		// Comment out backend call for now
		/*
		const result = await createSongAction(songData);
		if (!result.success) {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}
		*/

		toast({
			title: 'Success',
			description: 'Song created successfully',
		});

		setIsOpen(false);
		e.currentTarget.reset();
		setIsLoading(false);
	};

	const currentYear = new Date().getFullYear();

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" leadingIcon={PlusCircle}>
					Add Song
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new song</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="Title"
						required
						type="text"
						id="title"
						name="title"
						placeholder="Enter song title"
						minLength={1}
						maxLength={100}
					/>
					<FormField
						label="Song URL"
						required
						type="url"
						id="songUrl"
						name="songUrl"
						placeholder="Enter song URL"
						pattern="https?://.+"
					/>
					<FormField
						label="Cover URL"
						required
						type="url"
						id="coverUrl"
						name="coverUrl"
						placeholder="Enter cover image URL"
						pattern="https?://.+"
					/>
					<FormField
						label="Release Year"
						required
						type="number"
						id="releaseYear"
						name="releaseYear"
						min={1900}
						max={currentYear}
						defaultValue={currentYear}
					/>
					<FormField
						label="Song Length (seconds)"
						required
						type="number"
						id="songLength"
						name="songLength"
						min={1}
						placeholder="Enter song length in seconds"
					/>
					<div className="space-y-2">
						<label htmlFor="artistId" className="text-sm font-medium">
							Artist
							<span className="text-red-500">*</span>
						</label>
						<Select name="artistId" required>
							<SelectTrigger id="artistId">
								<SelectValue placeholder="Select artist" />
							</SelectTrigger>
							<SelectContent>
								{artists.map((artist) => (
									<SelectItem key={artist.id} value={artist.id.toString()}>
										{artist.nickname}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<label htmlFor="genreId" className="text-sm font-medium">
							Genre
							<span className="text-red-500">*</span>
						</label>
						<Select name="genreId" required>
							<SelectTrigger id="genreId">
								<SelectValue placeholder="Select genre" />
							</SelectTrigger>
							<SelectContent>
								{genres.map((genre) => (
									<SelectItem key={genre.id} value={genre.id.toString()}>
										{genre.genreName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							Create
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
