'use client';

import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';
import { clearLocalStorage } from '@/utils';

export const AccountList = () => {
	const accounts = useAccountingStore((state) => state.accounts);
	const operations = useAccountingStore((state) => state.operations);

	return (
		<>
			<Box textAlign="right" pb={4}>
				<Button variant="contained" onClick={() => clearLocalStorage()}>
					Wyczyść
				</Button>
			</Box>
			<Grid container spacing={2}>
				{accounts.map((account) => (
					<Grid item xs={12} md={6} key={account.name}>
						<Card>
							<CardContent>
								<Typography variant="h6" align="center" gutterBottom fontWeight={700}>
									{account.name}
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Typography align="center">Strona Debetowa</Typography>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell align="center">Numer</TableCell>
													<TableCell align="center">Kwota</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{operations
													.filter(
														(operation) =>
															(operation.fromAccount === account.name &&
																operation.fromSide === 'debit') ||
															(operation.toAccount === account.name &&
																operation.toSide === 'debit'),
													)
													.map((operation, index) => (
														<TableRow key={index}>
															<TableCell align="center">{operation.operationNumber}</TableCell>
															<TableCell align="center">{operation.amount}</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</Grid>
									<Grid item xs={6}>
										<Typography align="center">Strona Kredytowa</Typography>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell align="center">Kwota</TableCell>
													<TableCell align="center">Numer</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{operations
													.filter(
														(operation) =>
															(operation.fromAccount === account.name &&
																operation.fromSide === 'credit') ||
															(operation.toAccount === account.name &&
																operation.toSide === 'credit'),
													)
													.map((operation, index) => (
														<TableRow key={index}>
															<TableCell align="center">{operation.amount}</TableCell>
															<TableCell align="center">{operation.operationNumber}</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</>
	);
};
