'use client';

import { useState, useEffect } from 'react';

import {
	Button,
	Card,
	CardContent,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';
import { Account } from '@/types';

export const InitialBalanceForm = () => {
	const setInitialBalance = useAccountingStore((state) => state.setInitialBalance);
	const accounts = useAccountingStore((state) => state.accounts) || [];
	const [selectedAccount, setSelectedAccount] = useState<Account | null | undefined>(
		accounts.length > 0 ? accounts[0] : null,
	);
	const [credit, setCredit] = useState<number | string>(0);
	const [debit, setDebit] = useState<number | string>(0);

	useEffect(() => {
		if (selectedAccount) {
			setCredit(selectedAccount.type === 'credit' ? 0 : '');
			setDebit(selectedAccount.type === 'debit' ? 0 : '');
		}
	}, [selectedAccount]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedAccount) {
			setInitialBalance({
				name: selectedAccount.name as string,
				credit: selectedAccount.type === 'credit' ? Number(credit) : 0,
				debit: selectedAccount.type === 'debit' ? Number(debit) : 0,
			});
		}
	};

	const handleAccountChange = (event: SelectChangeEvent<string>) => {
		const accountName = event.target.value as string;
		const account = accounts.find((acc) => acc.name === accountName) || null;

		setSelectedAccount(account);
		setCredit(0);
		setDebit(0);
	};

	return (
		<Card variant="outlined">
			<CardContent>
				<Typography variant="h5" gutterBottom>
					Ustaw saldo początkowe
				</Typography>
				<form onSubmit={handleSubmit}>
					<Select
						label="Wybierz konto"
						value={selectedAccount?.name || ''}
						onChange={handleAccountChange}
						required
						fullWidth
					>
						{accounts.map((account) => (
							<MenuItem key={account.name} value={account.name}>
								{account.name}
							</MenuItem>
						))}
					</Select>

					{selectedAccount?.type === 'debit' && (
						<TextField
							label="Saldo debetowe"
							type="number"
							value={debit}
							onChange={(e) => setDebit(e.target.value === '' ? '' : Number(e.target.value))}
							required
							fullWidth
							margin="normal"
						/>
					)}

					{selectedAccount?.type === 'credit' && (
						<TextField
							label="Saldo kredytowe"
							type="number"
							value={credit}
							onChange={(e) => setCredit(e.target.value === '' ? '' : Number(e.target.value))}
							required
							fullWidth
							margin="normal"
						/>
					)}

					<Button type="submit" variant="contained" color="primary">
						Ustaw saldo
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default InitialBalanceForm;
