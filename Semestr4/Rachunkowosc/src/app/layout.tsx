import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import { Container } from '@mui/material';

import { Footer } from '@/components/Footer';
import { MyThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';

import './globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
	title: 'Rachunkowość',
	description: 'Projekt z przedmiotu Rachunkowość Komputerowa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			<body className={roboto.className}>
				<MyThemeProvider>
					<Navbar />
					<main>
						<Container sx={{ mt: 5, px: 2 }}>{children}</Container>
					</main>
					<Footer />
				</MyThemeProvider>
			</body>
		</html>
	);
}
