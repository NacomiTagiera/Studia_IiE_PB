import { Music2, Users } from 'lucide-react';

import Link from 'next/link';

interface AdminCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	href: string;
}

const AdminCard = ({ icon, title, description, href }: AdminCardProps) => (
	<Link
		href={href}
		className="flex flex-1 items-start gap-4 rounded-xl bg-slate-800/50 p-6 transition-colors hover:bg-slate-800/70"
	>
		<div className="rounded-lg bg-brand/10 p-2 text-brand">{icon}</div>
		<div>
			<h2 className="text-xl font-semibold text-white">{title}</h2>
			<p className="mt-1 text-sm text-neutral-400">{description}</p>
		</div>
	</Link>
);

export const AdminCards = () => {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<AdminCard
				icon={<Users className="size-5" />}
				title="Manage Artists"
				description="Add, edit, or remove artists from the platform"
				href="/admin/artists"
			/>
			<AdminCard
				icon={<Music2 className="size-5" />}
				title="Manage Songs"
				description="Add, edit, or remove songs from the platform"
				href="/admin/songs"
			/>
		</div>
	);
};
