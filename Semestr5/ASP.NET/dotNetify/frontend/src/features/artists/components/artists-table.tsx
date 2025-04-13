'use client';

import { useMemo } from 'react';
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

import { deleteArtistAction } from '../actions';
import { type Artist } from '../types';

import { EditArtistForm } from './edit-artist-form';

const columnHelper = createColumnHelper<Artist>();

interface Props {
	artists: Artist[];
}

export const ArtistsTable = ({ artists }: Props) => {
	const { toast } = useToast();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleDelete = async (id: number) => {
		const result = await deleteArtistAction(id);
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
			columnHelper.accessor('nickname', {
				header: 'Artist Name',
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
							<EditArtistForm artist={info.row.original} />
							<ConfirmModal
								title="Delete artist"
								description="Are you sure you want to delete this artist? This action cannot be undone."
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
		data: artists,
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
