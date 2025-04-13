import { redirect } from 'next/navigation';

import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { AudioPlayer } from '@/components/shared/audio-player';
import { PlaybackControls } from '@/components/shared/playback-controls';
import { getToken } from '@/lib/get-token';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const token = await getToken();

	if (!token) {
		redirect('/login');
	}

	return (
		<>
			<AudioPlayer />
			<Header />
			<div className="flex flex-1 gap-x-2">
				<aside className="sticky top-16 flex h-screen w-1/6 max-w-xs flex-col gap-2 md:w-1/5">
					<Sidebar />
				</aside>
				<main className="w-5/6 bg-slate-900 pb-20 md:w-4/5">{children}</main>
			</div>
			<PlaybackControls />
		</>
	);
}
