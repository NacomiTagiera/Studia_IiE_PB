import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

import './globals.css';

const figtree = Figtree({
	subsets: ['latin'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	variable: '--font-figtree',
});

export const metadata: Metadata = {
	title: '.NETify',
	description: 'The best Spotify clone',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				className={cn(
					'flex min-h-screen flex-col overflow-x-hidden bg-slate-950 antialiased',
					figtree.className,
				)}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
