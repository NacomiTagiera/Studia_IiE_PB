import { Card } from '@mui/material';

import { Header } from '@/components/Header';
import { OperationForm } from '@/components/OperationForm';

export default function AddOperationPage() {
	return (
		<>
			<Header>Dodaj operację</Header>
			<Card variant="outlined" sx={{ py: 4, maxWidth: 'md', mx: 'auto' }}>
				<OperationForm />
			</Card>
		</>
	);
}
