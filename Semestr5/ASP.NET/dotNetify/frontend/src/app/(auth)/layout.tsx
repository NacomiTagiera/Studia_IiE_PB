import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { getToken } from '@/lib/get-token';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const token = await getToken();

	if (token) {
		redirect('/');
	}

	return (
		<main className="flex min-h-svh w-full items-center justify-center bg-slate-900 p-6 md:p-10">
			<div className="grid w-full max-w-sm gap-6">
				<h1 className="text-center text-2xl font-bold text-brand md:text-4xl md:font-extrabold">.NETify</h1>
				<Card className="bg-slate-800/50">{children}</Card>
				<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
					By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
					<Link href="#">Privacy Policy</Link>.
				</div>
			</div>
		</main>
	);
}
