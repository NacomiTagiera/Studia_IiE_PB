import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/users/data-access';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const user = await getCurrentUser();

	if (user?.role !== 'admin') {
		return redirect('/');
	}

	return children;
}
