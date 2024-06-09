'use client';

import {
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Card,
	CardContent,
} from '@mui/material';
import { useAccountingStore } from '@/store/useAccountingStore';

export const OperationHistory = () => {
	const operations = useAccountingStore((state) => state.operations);

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				Historia wszystkich operacji
			</Typography>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Nazwa operacji</TableCell>
								<TableCell>Data</TableCell>
								<TableCell>Numer</TableCell>
								<TableCell>Kwota</TableCell>
								<TableCell>Typ operacji</TableCell>
								<TableCell>Z konta</TableCell>
								<TableCell>Na konto</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{operations
								.filter((operaion) => operaion.number !== 'Sp')
								.map((operation, index) => (
									<TableRow key={index}>
										<TableCell>{operation.name}</TableCell>
										<TableCell>{operation.date}</TableCell>
										<TableCell>{operation.number}</TableCell>
										<TableCell>{operation.amount}</TableCell>
										<TableCell>{operation.type}</TableCell>
										<TableCell>{operation.fromAccount}</TableCell>
										<TableCell>{operation.toAccount}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</Container>
	);
};
