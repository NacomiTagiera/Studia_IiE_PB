import { AdminCards } from './components/admin-cards';

export default function AdminPage() {
	return (
		<div className="space-y-6 rounded-xl p-6">
			<h1 className="text-2xl font-bold">Admin Dashboard</h1>
			<AdminCards />
		</div>
	);
}
