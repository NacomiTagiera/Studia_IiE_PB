'use client';

import { type FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { ActionButton } from '@/components/shared/action-button';
import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { useToast } from '@/hooks/use-toast';

import { createPlaylistAction } from '../actions';

export const CreatePlaylistModal = () => {
	const [open, setOpen] = useState(false);
	const [issues, setIssues] = useState<Record<string, string[]>>({});
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const playlistName = (event.currentTarget.playlistName as HTMLInputElement).value;
		const playlistDescription = (event.currentTarget.playlistDescription as HTMLInputElement).value;

		const result = await createPlaylistAction({ playlistName, playlistDescription });

		if (result.status === 'error') {
			toast({ title: 'Oops! An error occurred', description: result.message, variant: 'destructive' });
			if (result.issues) {
				setIssues(result.issues);
			}
		} else if (result.status === 'success') {
			router.push(`/playlists/${result.playlistId}`);
			setOpen(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<IconButton
					icon={Plus}
					label="Create playlist"
					className="text-white/80 hover:text-white"
					onClick={() => setOpen(true)}
				/>
			</DialogTrigger>
			<DialogContent className="border-slate-800 bg-slate-900 text-slate-200 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create playlist</DialogTitle>
					<DialogDescription className="text-slate-400">
						Create a new playlist to organize your music.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="Name"
						id="playlistName"
						name="playlistName"
						placeholder="New playlist"
						required
						error={issues?.playlistName?.[0]}
					/>
					<FormField
						label="Description"
						id="playlistDescription"
						name="playlistDescription"
						placeholder="Give your playlist a catchy description"
						required
						error={issues?.playlistDescription?.[0]}
					/>

					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<ActionButton size="default">Create</ActionButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
