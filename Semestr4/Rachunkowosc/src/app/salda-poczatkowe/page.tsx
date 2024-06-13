import { Card, CardContent } from '@mui/material';

import { Header } from '@/components/Header';
import { InitialBalanceForm } from '@/components/InitialBalanceForm';

export default function InitialBalancePage() {
	return (
		<>
			<Header>Ustaw saldo początkowe</Header>
			<Card variant="outlined" sx={{ maxWidth: 'md', mx: 'auto' }}>
				<CardContent>
					<InitialBalanceForm></InitialBalanceForm>
				</CardContent>
			</Card>
		</>
	);
}
