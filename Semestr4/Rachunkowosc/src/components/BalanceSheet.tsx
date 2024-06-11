'use client';

import { useState } from 'react';

import {
	Grid,
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Stack,
} from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';

import { useAccountingStore } from '@/store/useAccountingStore';

import { SubmitButton } from './SubmitButton';

export const BalanceSheet = () => {
	const [balanceDate, setBalanceDate] = useState<Dayjs | null>(dayjs());
	const [balances, setBalances] = useState<{ name: string; type: string; balance: number }[]>([]);

	const getAccountBalancesUntilDate = useAccountingStore(
		(state) => state.getAccountBalancesUntilDate,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (balanceDate) {
			const formattedDate = balanceDate.format('DD.MM.YYYY');
			const newBalances = getAccountBalancesUntilDate(formattedDate);
			setBalances(newBalances);
		}
	};

	const getBalanceForAccount = (accountName: string) => {
		const account = balances.find((balance) => balance.name === accountName);
		return account ? account.balance : 0;
	};

	const assetsSum = balances.reduce((acc, balance) => {
		if (balance.type === 'debit') {
			return acc + balance.balance;
		}

		return acc;
	}, 0);

	const liabilitiesSum = balances.reduce((acc, balance) => {
		if (balance.type === 'credit') {
			return acc + balance.balance;
		}

		return acc;
	}, 0);

	return (
		<>
			<Stack
				component="form"
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				paddingBlock={4}
				onSubmit={handleSubmit}
			>
				<Typography fontWeight="600">Sporządzony na dzień:</Typography>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
					<DateField
						name="balance-date"
						label="Data"
						value={balanceDate}
						onChange={(newValue) => setBalanceDate(newValue)}
					/>
				</LocalizationProvider>
				<SubmitButton>Sporządź</SubmitButton>
			</Stack>
			<Grid container columnSpacing={2} rowSpacing={4}>
				<Grid item xs={12} lg={6}>
					<Card>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Typography variant="h5" component="h3">
									Aktywa
								</Typography>
								<Typography fontWeight={600}>Kwota</Typography>
							</Stack>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>
											<strong>A. Aktywa trwałe</strong>
										</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Urządzenia techniczne i maszyny') +
												getBalanceForAccount('Środki transportu') -
												getBalanceForAccount('Amortyzacja')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>I Wartości niematerialne i prawne</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>II Rzeczowe aktywa trwałe</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Urządzenia techniczne i maszyny') +
												getBalanceForAccount('Środki transportu') -
												getBalanceForAccount('Amortyzacja')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>III Należności długoterminowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>IV Inwestycje długoterminowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>V Długoterminowe rozliczenia międzyokresowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>B. Aktywa obrotowe</strong>
										</TableCell>
										<TableCell align="right">
											{getBalanceForAccount(
												'Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy',
											) +
												getBalanceForAccount('Środki pieniężne w kasie') +
												getBalanceForAccount('Środki pieniężne na r-kach bankowych')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>I Zapasy</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>II Należności krótkoterminowe</TableCell>
										<TableCell align="right">
											{getBalanceForAccount(
												'Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy',
											)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>III Inwestycje krótkoterminowe</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Środki pieniężne w kasie') +
												getBalanceForAccount('Środki pieniężne na r-kach bankowych')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>IV Krótkoterminowe rozliczenia międzyokresowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>C. Należne wpłaty na kapitał podstawowy</strong>
										</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>D. Udziały (akcje) własne</strong>
										</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>Aktywa razem</strong>
										</TableCell>
										<TableCell align="right">
											{assetsSum - getBalanceForAccount('Amortyzacja')}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} lg={6}>
					<Card>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Typography variant="h5" component="h3">
									Pasywa
								</Typography>
								<Typography fontWeight={600}>Kwota</Typography>
							</Stack>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>
											<strong>A. Kapitał własny</strong>
										</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Kapitał podstawowy') +
												getBalanceForAccount('Zysk (strata) netto')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>I Kapitał podstawowy</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Kapitał podstawowy')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>II Kapitał zapasowy</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>III Kapitał z aktualizacji wyceny</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>IV Pozostałe kapitały rezerwowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>V Zysk (strata) z lat ubiegłych</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>VI Zysk (strata) netto</TableCell>
										<TableCell align="right">
											{getBalanceForAccount('Zysk (strata) netto')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>VII Odpisy z zysku netto w ciągu roku obrotowego (-)</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>B. Zobowiązania i rezerwy na zobowiązania</strong>
										</TableCell>
										<TableCell align="right">
											{getBalanceForAccount(
												'Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy',
											) +
												getBalanceForAccount('Zobowiązania z tytułu wynagrodzeń') +
												getBalanceForAccount('Zobowiązania z tytułów publicznoprawnych') +
												getBalanceForAccount('Kredyty bankowe krótkoterminowe')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>I Rezerwy na zobowiązania</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>II Zobowiązania długoterminowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>III Zobowiązania krótkoterminowe</TableCell>
										<TableCell align="right">
											{getBalanceForAccount(
												'Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy',
											) +
												getBalanceForAccount('Zobowiązania z tytułu wynagrodzeń') +
												getBalanceForAccount('Zobowiązania z tytułów publicznoprawnych') +
												getBalanceForAccount('Kredyty bankowe krótkoterminowe')}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>IV Rozliczenia międzyokresowe</TableCell>
										<TableCell align="right">0</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<strong>Pasywa razem</strong>
										</TableCell>
										<TableCell align="right">
											{liabilitiesSum -
												getBalanceForAccount('Umorzenie środków transportu') -
												getBalanceForAccount('Umorzenie urządzeń technicznych i maszyn')}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	);
};
