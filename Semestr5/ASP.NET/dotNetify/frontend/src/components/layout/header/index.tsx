import Image from 'next/image';
import Link from 'next/link';

import logo from '@/public/logo.png';

import { SearchBar } from './search-bar';
import { UserMenu } from './user-menu';

export const Header = () => {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-x-4 bg-slate-950 px-4">
			<Link href="/">
				<div className="flex items-center gap-2">
					<Image src={logo} alt=".NETify logo" width={32} height={32} priority />
					<h1 className="sr-only text-3xl font-semibold text-brand md:not-sr-only">.NETify</h1>
				</div>
			</Link>
			<SearchBar />
			<UserMenu />
		</header>
	);
};
