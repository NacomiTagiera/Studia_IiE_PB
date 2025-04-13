'use client';

import { type FormEvent, useState } from 'react';
import { Pencil } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

import { updateArtistAction } from '../actions';
import { type Artist } from '../types';

interface Props {
	artist: Artist;
}

export const EditArtistForm = ({ artist }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const nickname = (e.currentTarget.nickname as HTMLInputElement).value;
		const imageUrl = (e.currentTarget.imageUrl as HTMLInputElement).value;

		const result = await updateArtistAction(artist.id, { nickname, imageUrl });

		if (result.success) {
			toast({
				title: 'Success',
				description: result.message,
			});
			setIsOpen(false);
		} else {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			});
		}

		setIsLoading(false);
		router.refresh();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<DropdownMenuItem className="text-slate-200 hover:text-white" onSelect={(e) => e.preventDefault()}>
					<Pencil className="mr-2 size-4" aria-hidden />
					<span>Edit</span>
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit artist</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="Artist Name"
						required
						type="text"
						id="nickname"
						name="nickname"
						placeholder="Enter artist name"
						minLength={3}
						maxLength={50}
						defaultValue={artist.nickname}
					/>
					<FormField
						label="Image URL"
						required
						type="url"
						id="imageUrl"
						name="imageUrl"
						placeholder="Enter image URL"
						pattern="https?://.+"
						defaultValue={artist.imageUrl}
					/>
					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							Save changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
