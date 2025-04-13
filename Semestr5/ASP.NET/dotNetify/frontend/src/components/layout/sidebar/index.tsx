import { HomeIcon, Library, Music } from 'lucide-react';

import Link from 'next/link';

import { ScrollArea } from '@/components/ui/scroll-area';
import { CreatePlaylistModal } from '@/features/playlists/components/create-playlist-modal';
import { getUserPlaylists } from '@/features/playlists/data-access';

import { SidebarItem } from './sidebar-item';
import { SidebarPlaylist } from './sidebar-playlist';

export const Sidebar = async () => {
	const playlists = await getUserPlaylists();

	return (
		<>
			<div className="space-y-2 rounded-xl bg-slate-900 p-2 pt-6 md:pt-2">
				<SidebarItem href="/" icon={HomeIcon} label="Home" />
				<SidebarItem href="/history" icon={Music} label="Your History" />
			</div>
			<div className="flex-1 rounded-xl bg-slate-900 p-2 md:px-4">
				<div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
					<Link
						href="/library"
						aria-label="Library"
						title="Library"
						className="flex items-center px-2 text-white/80 hover:text-white"
					>
						<Library className="mr-2 size-5" aria-hidden="true" />
						<span className="hidden md:block">Library</span>
					</Link>
					<CreatePlaylistModal />
				</div>
				<ScrollArea className="h-[calc(100vh-300px)]">
					<div className="space-y-2">
						{playlists.map((playlist) => (
							<SidebarPlaylist key={playlist.id} playlist={playlist} />
						))}
					</div>
				</ScrollArea>
			</div>
		</>
	);
};
