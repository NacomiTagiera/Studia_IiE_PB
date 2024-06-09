'use client';

import { useState } from 'react';

import { Autocomplete, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import 'dayjs/locale/pl';

import { useAccountingStore } from '@/store/useAccountingStore';
import { Operation, OperationType } from '@/types';

import { Notification } from './Notification';

export const OperationForm = () => {
	const addOperation = useAccountingStore((state) => state.addOperation);
	const updateAccounts = useAccountingStore((state) => state.updateAccounts);
	const accounts = useAccountingStore((state) => state.accounts) || [];

	const [operationType, setOperationType] = useState<OperationType>('aktywna');
	const [notificationOpen, setNotificationOpen] = useState(false);

	const handleCloseNotification = (_e: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotificationOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const operation: Operation = {
			name: formData.get('operation-name') as string,
			date: formData.get('operation-date') as string,
			number: formData.get('operation-number') as unknown as number,
			amount: parseFloat(formData.get('amount') as string),
			type: formData.get('operation-type')?.toString().toLowerCase() as OperationType,
			fromAccount: formData.get('from-account') as string,
			fromSide: formData.get('from-side') === 'Debetowa' ? 'debit' : 'credit',
			toAccount: formData.get('to-account') as string,
			toSide: formData.get('to-side') === 'Debetowa' ? 'debit' : 'credit',
		};

		addOperation(operation);
		updateAccounts(operation);
	};

	const getAccountOptions = (type: OperationType) => {
		switch (type.toLowerCase()) {
			case 'aktywna':
				return accounts.filter((account) => account.type === 'debit');
			case 'pasywna':
				return accounts.filter((account) => account.type === 'credit');
			case 'aktywno-pasywna':
				return accounts;
			default:
				return [];
		}
	};

	return (
		<>
			<Card variant="outlined" sx={{ py: 4 }}>
				<Typography component="h1" variant="h3" gutterBottom align="center">
					Dodaj Operację
				</Typography>
				<Stack component="form" onSubmit={handleSubmit} justifyContent="center" spacing={4} p={6}>
					<TextField name="operation-name" label="Nazwa operacji" required />
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
						<DatePicker name="operation-date" label="Data" />
					</LocalizationProvider>
					<TextField
						name="operation-number"
						label="Numer operacji"
						inputProps={{
							type: 'number',
							min: 1,
							max: 9999,
						}}
						required
					/>
					<TextField
						name="amount"
						label="Kwota"
						inputProps={{
							type: 'number',
							step: 1,
						}}
						required
					/>
					<Autocomplete
						disablePortal
						id="operation-type"
						options={['Aktywna', 'Pasywna', 'Aktywno-pasywna']}
						onChange={(_e, value) => setOperationType(value as OperationType)}
						renderInput={(params) => (
							<TextField {...params} label="Typ operacji" name="operation-type" />
						)}
					/>
					<Autocomplete
						disablePortal
						id="from-account"
						options={getAccountOptions(operationType).map((account) => account.name)}
						renderInput={(params) => <TextField {...params} label="Z konta" name="from-account" />}
					/>
					<Autocomplete
						disablePortal
						id="from-side"
						options={['Debetowa', 'Kredytowa']}
						renderInput={(params) => <TextField {...params} label="Strona" name="from-side" />}
					/>
					<Autocomplete
						disablePortal
						id="to-account"
						options={getAccountOptions(operationType).map((account) => account.name)}
						renderInput={(params) => <TextField {...params} label="Na konto" name="to-account" />}
					/>
					<Autocomplete
						disablePortal
						id="to-side"
						options={['Debetowa', 'Kredytowa']}
						renderInput={(params) => <TextField {...params} label="Strona" name="to-side" />}
					/>

					<Button type="submit" variant="contained">
						Dodaj operację
					</Button>
				</Stack>
			</Card>
			<Notification
				open={notificationOpen}
				message="Operacja dodana pomyślnie"
				onClose={handleCloseNotification}
			/>
		</>
	);
};
