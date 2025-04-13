'use client';

import { useMemo, useOptimistic } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { MoreVertical, Trash2 } from 'lucide-react';

import { ConfirmModal } from '@/components/shared/confirm-modal';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

import { type CreateSong, deleteSongAction } from '../actions';
import { type Song } from '../types';

const columnHelper = createColumnHelper<Song>();

interface Props {
	songs: Song[];
}

export const AdminSongsTable = ({ songs: initialSongs }: Props) => {
	const { toast } = useToast();
	const [songs, _addSong] = useOptimistic(initialSongs, (state: Song[], newSong: Song) => [
		...state,
		newSong,
	]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleDelete = async (id: number) => {
		const result = await deleteSongAction(id);
		if (result.success) {
			toast({
				title: 'Success',
				description: result.message,
			});
		} else {
			toast({
				title: 'Error',
				description: result.error,
				variant: 'destructive',
			});
		}
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor('title', {
				header: 'Title',
				cell: (info) => (
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-neutral-200">{info.getValue()}</span>
					</div>
				),
			}),
			columnHelper.accessor('id', {
				header: 'Actions',
				cell: (info) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-800">
								<span className="sr-only">Open menu</span>
								<MoreVertical className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[160px] border-slate-800 bg-slate-900">
							{/* Edit form will go here */}
							<ConfirmModal
								title="Delete song"
								description="Are you sure you want to delete this song? This action cannot be undone."
								cancelBtn="Cancel"
								confirmBtn="Delete"
								onConfirm={() => handleDelete(info.getValue())}
							>
								<DropdownMenuItem
									className="text-red-400 hover:text-red-400"
									onSelect={(e) => e.preventDefault()}
								>
									<Trash2 className="mr-2 size-4" aria-hidden />
									<span>Delete</span>
								</DropdownMenuItem>
							</ConfirmModal>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			}),
		],
		[handleDelete],
	);

	const table = useReactTable({
		data: songs,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded-xl bg-slate-800/50 p-6">
			<div className="relative overflow-x-auto">
				<table className="w-full table-fixed text-left">
					<thead className="border-b border-white/5">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="pb-4 text-sm font-medium text-neutral-400">
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
							<tr key={row.id} className="h-14 rounded-md">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="first:rounded-l-md last:rounded-r-md">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

// Export for use in create form
export const createOptimisticSong = (data: CreateSong): Song => ({
	id: Math.random(), // Temporary ID
	title: data.title,
	songUrl: data.songUrl,
	coverUrl: data.coverUrl,
	releaseYear: data.releaseYear,
	songLength: data.songLength,
	genreId: data.genreId,
	viewCount: 0,
	artist: null, // Will be populated by backend
});
