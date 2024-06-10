'use client';

import { useState } from 'react';

import { Autocomplete, Card, CardContent, TextField } from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';
import { Account } from '@/types';

import { Header } from './Header';
import { Notification } from './Notification';
import { SubmitButton } from './SubmitButton';

export const InitialBalanceForm = () => {
	const setInitialBalance = useAccountingStore((state) => state.setInitialBalance);
	const accounts = useAccountingStore((state) => state.accounts) || [];

	const [selectedAccount, setSelectedAccount] = useState<Account | null | undefined>(
		accounts.length > 0 ? accounts[0] : null,
	);
	const [amount, setAmount] = useState<number | string>(0);
	const [notificationOpen, setNotificationOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedAccount) return null;

		setInitialBalance({
			name: selectedAccount.name as string,
			credit: selectedAccount.type === 'credit' ? Number(amount) : 0,
			debit: selectedAccount.type === 'debit' ? Number(amount) : 0,
		});

		setNotificationOpen(true);
		setAmount(0);
	};

	return (
		<>
			<Header>Ustaw saldo początkowe</Header>
			<Card variant="outlined">
				<CardContent>
					<form onSubmit={handleSubmit}>
						<Autocomplete
							disablePortal
							id="account-name"
							options={accounts.map((account) => account.name)}
							onChange={(_e, value) =>
								setSelectedAccount(accounts.find((account) => account.name === value) || null)
							}
							renderInput={(params) => (
								<TextField {...params} label="Wybierz konto" name="account-name" />
							)}
						/>
						<TextField
							label={selectedAccount?.type === 'debit' ? 'Saldo debetowe' : 'Saldo kredytowe'}
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
							required
							fullWidth
							margin="normal"
						/>

						<SubmitButton>Ustaw saldo</SubmitButton>
					</form>
				</CardContent>
			</Card>
			<Notification
				open={notificationOpen}
				message="Saldo początkowe zostało ustawione"
				onClose={(_e, reason) => {
					if (reason === 'clickaway') {
						return;
					}

					setNotificationOpen(false);
				}}
			/>
		</>
	);
};
