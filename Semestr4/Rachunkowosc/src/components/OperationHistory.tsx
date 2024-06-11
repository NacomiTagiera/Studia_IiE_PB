'use client';

import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';
import { Header } from './Header';

export const OperationHistory = () => {
	const operations = useAccountingStore((state) => state.operations);

	return (
		<>
			<Header>Historia wszystkich operacji</Header>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Nazwa operacji
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Data
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Numer
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Kwota
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Z konta
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Na konto
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{operations
								.filter((operation) => operation.operationNumber !== 'Sp')
								.map((operation, index) => (
									<TableRow key={index}>
										<TableCell align="center">{operation.name}</TableCell>
										<TableCell align="center">{operation.date}</TableCell>
										<TableCell align="center">{operation.operationNumber}</TableCell>
										<TableCell align="center">{operation.amount}</TableCell>
										<TableCell align="center">{operation.fromAccount}</TableCell>
										<TableCell align="center">{operation.toAccount}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	);
};
