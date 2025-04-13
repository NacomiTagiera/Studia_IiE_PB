'use client';

import { useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AudioLines, Clock, Play, Trash2 } from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ConfirmModal } from '@/components/shared/confirm-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { deletePlaylistAction } from '@/features/playlists/actions';
import { useToast } from '@/hooks/use-toast';
import { cn, formatTime } from '@/lib/utils';
import { usePlayerStore } from '@/store/use-player-store';

import { type Song } from '../types';

const columnHelper = createColumnHelper<Song>();

interface Props {
	id?: number;
	songs: Song[];
	title: string;
	image?: string;
	type?: 'playlist' | 'artist';
}

export const SongsTable = ({ id, songs, title, image, type = 'playlist' }: Props) => {
	const { currentSong, isPlaying, playPlaylist } = usePlayerStore();
	const { toast } = useToast();
	const router = useRouter();

	const handlePlay = async (startIndex: number = 1) => {
		await playPlaylist(songs, startIndex - 1);
	};

	const handleDelete = async () => {
		if (!id) return;

		const result = await deletePlaylistAction(id);
		if (result?.success === false) {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			});
		} else {
			router.push('/');
			router.refresh();
		}
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.id, {
				header: '#',
				cell: (info) => (
					<div className="flex items-center gap-2">
						{currentSong?.id === info.row.original.id ? (
							<AudioLines className={cn('size-4 text-brand-400', isPlaying && 'animate-pulse')} />
						) : (
							<span className="text-sm font-medium text-neutral-200">{info.row.index + 1}</span>
						)}
					</div>
				),
			}),
			columnHelper.accessor('title', {
				header: 'Title',
				cell: (info) => (
					<div className="flex items-center gap-4">
						<span
							className={cn(
								'text-sm font-medium text-neutral-200',
								currentSong?.id === info.row.original.id && 'text-brand-400',
							)}
						>
							{info.getValue()}
						</span>
					</div>
				),
			}),
			columnHelper.accessor('artist.nickname', {
				header: 'Artist',
				cell: (info) => <span className="text-sm text-neutral-400">{info.getValue() || title}</span>,
			}),
			columnHelper.accessor('releaseYear', {
				header: 'Release year',
				cell: (info) => <span className="text-sm text-neutral-400">{info.getValue()}</span>,
			}),
			columnHelper.accessor('songLength', {
				header: () => (
					<TooltipProvider>
						<Tooltip delayDuration={300}>
							<TooltipTrigger asChild>
								<Clock className="size-4" aria-label="Song duration" />
							</TooltipTrigger>
							<TooltipContent side="top" align="center">
								<p className="text-sm">Duration</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				),
				cell: (info) => <span className="text-sm text-neutral-400">{formatTime(info.getValue())}</span>,
			}),
		],
		[currentSong?.id, isPlaying, title],
	);

	const table = useReactTable({
		data: songs,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const length = songs.reduce((acc, song) => acc + song.songLength, 0);

	return (
		<div className="space-y-6">
			<div className="flex items-end gap-6 rounded-t-xl bg-gradient-to-b from-slate-600/50 to-slate-900/50 p-6">
				<div className="size-[232px] flex-shrink-0">
					<Image
						src={image || '/album.jpg'}
						alt={title}
						className="size-full rounded-md object-cover shadow-lg"
						priority
						width={232}
						height={232}
					/>
				</div>
				<div className="flex items-center gap-4">
					<Button
						aria-label="Play"
						size="icon"
						className="rounded-full bg-brand p-0 text-white hover:scale-105 hover:bg-brand/90"
						onClick={() => handlePlay()}
					>
						<span className="sr-only">Play</span>
						<Play className="size-4 fill-white" />
					</Button>
					{type === 'playlist' && (
						<ConfirmModal
							title="Delete playlist"
							description="Are you sure you want to delete this playlist? This action cannot be undone."
							cancelBtn="Cancel"
							confirmBtn="Delete"
							onConfirm={handleDelete}
						>
							<Button
								aria-label="Delete playlist"
								size="icon"
								variant="destructive"
								className="rounded-full p-0 hover:scale-105"
							>
								<span className="sr-only">Delete playlist</span>
								<Trash2 className="size-4" />
							</Button>
						</ConfirmModal>
					)}
				</div>
				<div className="flex flex-col gap-6">
					<div>
						<p className="text-sm font-medium capitalize">{type}</p>
						<h1 className="mt-2 text-5xl font-bold">{title}</h1>
					</div>
					<div className="flex items-center gap-1 text-sm text-neutral-400">
						<span>
							{songs.length} {songs.length === 1 ? 'song' : 'songs'}
						</span>{' '}
						• <span>{formatTime(length)} minutes</span>
					</div>
				</div>
			</div>

			<div className="rounded-b-xl bg-slate-800/50 p-6">
				<div className="relative overflow-x-auto">
					<table className="w-full table-fixed text-left">
						<thead className="border-b border-white/5">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="pb-4 text-sm font-medium text-neutral-400"
											style={{ width: header.getSize() }}
										>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className={cn(
										'group h-14 cursor-pointer rounded-md transition-colors hover:bg-white/5',
										currentSong?.id === row.original.id && '!text-brand',
									)}
									onClick={() => handlePlay(row.index + 1)}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className={cn(
												'first:rounded-l-md last:rounded-r-md',
												currentSong?.id === row.original.id && '!text-brand',
											)}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
