'use client';

import { useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Clock } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatTime } from '@/lib/utils';

import { type Song } from '../types';

interface HistoryItem {
	id: number;
	song: Song;
	timestamp: string;
}

const columnHelper = createColumnHelper<HistoryItem>();

interface Props {
	history: HistoryItem[];
}

export const ListeningHistoryTable = ({ history }: Props) => {
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.song.title, {
				header: 'Title',
				cell: (info) => (
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium text-neutral-200">{info.getValue()}</span>
					</div>
				),
			}),
			columnHelper.accessor('song.artist.nickname', {
				header: 'Artist',
				cell: (info) => <span className="text-sm text-neutral-400">{info.getValue()}</span>,
			}),
			columnHelper.accessor('timestamp', {
				header: 'Played at',
				cell: (info) => (
					<span className="text-sm text-neutral-400">{new Date(info.getValue()).toLocaleString()}</span>
				),
			}),
			columnHelper.accessor('song.songLength', {
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
		[],
	);

	const table = useReactTable({
		data: history,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Listening History</h2>
			<div className="rounded-xl bg-slate-800/50 p-6">
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
		</div>
	);
};
