import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
	href: string;
	icon: LucideIcon;
	label: string;
}

export const SidebarItem = ({ href, icon, label }: Props) => {
	return (
		<Button
			href={href}
			variant="ghost"
			leadingIcon={icon}
			title={label}
			className="flex justify-center text-slate-200 hover:bg-slate-800 hover:text-white md:justify-start"
		>
			<span className="hidden md:block">{label}</span>
		</Button>
	);
};
