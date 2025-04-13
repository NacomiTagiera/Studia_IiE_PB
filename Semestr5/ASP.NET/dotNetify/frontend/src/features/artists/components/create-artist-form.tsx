'use client';

import { type FormEvent, useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

import { createArtistAction } from '../actions';

export const CreateArtistForm = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const nickname = (e.currentTarget.nickname as HTMLInputElement).value;
		const imageUrl = (e.currentTarget.imageUrl as HTMLInputElement).value;

		const result = await createArtistAction({ nickname, imageUrl });

		if (result.success) {
			toast({
				title: 'Success',
				description: result.message,
			});
			setIsOpen(false);
			e.currentTarget.reset();
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
				<Button variant="outline" leadingIcon={PlusCircle}>
					Add Artist
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new artist</DialogTitle>
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
					/>
					<FormField
						label="Image URL"
						required
						type="url"
						id="imageUrl"
						name="imageUrl"
						placeholder="Enter image URL"
						pattern="https?://.+"
					/>
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
