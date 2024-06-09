import { Typography } from '@mui/material';

import { AccountList } from '@/components/AccountList';

export default function Home() {
	return (
		<>
			<Typography variant="h3" component="h2" gutterBottom align="center">
				Lista kont
			</Typography>
			<AccountList />
		</>
	);
}
