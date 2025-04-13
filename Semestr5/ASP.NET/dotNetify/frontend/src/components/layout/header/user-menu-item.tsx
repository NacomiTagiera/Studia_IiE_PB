import { type IconType } from 'react-icons';
import { type LucideIcon } from 'lucide-react';

import { type Route } from 'next';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Props {
	icon: LucideIcon | IconType;
	children: React.ReactNode;
	href?: Route;
	onClick?: () => void;
	className?: string;
}

export const UserMenuItem = ({ icon: Icon, href, children, onClick, className }: Props) => {
	const content = (
		<>
			<Icon className="mr-2 size-4" aria-hidden />
			{children}
		</>
	);

	if (href) {
		return (
			<DropdownMenuItem className={className}>
				<Link href={href} className="flex w-full">
					{content}
				</Link>
			</DropdownMenuItem>
		);
	}

	return (
		<DropdownMenuItem className={cn('cursor-pointer', className)} onClick={onClick}>
			<div className="flex w-full">{content}</div>
		</DropdownMenuItem>
	);
};
