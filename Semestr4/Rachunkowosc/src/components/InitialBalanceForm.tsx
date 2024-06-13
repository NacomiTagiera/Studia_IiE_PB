'use client';

import { useState } from 'react';

import { Autocomplete, Stack, TextField } from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';
import { Account } from '@/types';

import { Notification } from './Notification';
import { SubmitButton } from './SubmitButton';
import { useNotification } from '@/hooks/useNotification';

export const InitialBalanceForm = () => {
	const setInitialBalance = useAccountingStore((state) => state.setInitialBalance);
	const accounts =
		useAccountingStore((state) =>
			state.accounts.filter((acc) => acc.credit === 0 && acc.debit === 0),
		) || [];

	const [selectedAccount, setSelectedAccount] = useState<Account | null | undefined>(
		accounts.length > 0 ? accounts[0] : null,
	);
	const [amount, setAmount] = useState<number | string>(0);
	const {
		notificationOpen,
		notificationMessage,
		status,
		showNotification,
		handleCloseNotification,
	} = useNotification();

	const validateBalance = () => {
		if (!selectedAccount) {
			return 'Wybierz konto';
		}

		if (typeof amount === 'string') {
			return 'Nieprawidłowe saldo początkowe';
		}

		return null;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const errorMessage = validateBalance();
		if (errorMessage) {
			showNotification(errorMessage, 'error');
			return;
		}

		setInitialBalance({
			name: selectedAccount?.name as string,
			credit: selectedAccount?.type === 'credit' ? Number(amount) : 0,
			debit: selectedAccount?.type === 'debit' ? Number(amount) : 0,
		});

		showNotification('Saldo początkowe zostało ustawione', 'success');
		setAmount(0);
		setSelectedAccount(accounts[0] || null);
	};

	return (
		<>
			<Stack
				component="form"
				alignItems="center"
				justifyContent="center"
				spacing={4}
				px={2}
				py={1}
				onSubmit={handleSubmit}
			>
				<Autocomplete
					disablePortal
					id="account-name"
					options={accounts.map((account) => account.name)}
					value={selectedAccount?.name || ''}
					onChange={(_e, value) =>
						setSelectedAccount(accounts.find((account) => account.name === value) || null)
					}
					renderInput={(params) => (
						<TextField {...params} label="Wybierz konto" name="account-name" />
					)}
					fullWidth
				/>
				<TextField
					label="Saldo początkowe"
					inputProps={{
						type: 'number',
						step: 1,
					}}
					value={amount}
					onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
					required
					fullWidth
				/>

				<SubmitButton>Ustaw saldo</SubmitButton>
			</Stack>
			<Notification
				open={notificationOpen}
				message={notificationMessage}
				severity={status}
				onClose={handleCloseNotification}
			/>
		</>
	);
};
