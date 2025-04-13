import { ListeningHistoryTable } from '@/features/songs/components/listening-history-table';
import { UserStats } from '@/features/songs/components/user-stats';
import { getUserHistory } from '@/features/songs/data-access';
import { getFavouriteGenres, getUserListeningTime } from '@/features/users/data-access';

export default async function HistoryPage() {
	const [history, genres, listeningTime] = await Promise.all([
		getUserHistory(),
		getFavouriteGenres(),
		getUserListeningTime(),
	]);

	return (
		<div className="space-y-6 rounded-xl p-6">
			<UserStats history={history} genres={genres} listeningTime={listeningTime} />
			<ListeningHistoryTable history={history} />
		</div>
	);
}
