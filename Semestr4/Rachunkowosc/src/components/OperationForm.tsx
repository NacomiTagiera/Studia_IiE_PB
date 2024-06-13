'use client';

import { useState } from 'react';

import { Autocomplete, Grid, Stack, TextField } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import 'dayjs/locale/pl';

import { useNotification } from '@/hooks/useNotification';
import { useAccountingStore } from '@/store/useAccountingStore';
import { Operation, OperationType } from '@/types';

import { Notification } from './Notification';
import { SubmitButton } from './SubmitButton';

export const OperationForm = () => {
	const addOperation = useAccountingStore((state) => state.addOperation);
	const updateAccounts = useAccountingStore((state) => state.updateAccounts);
	const accounts = useAccountingStore((state) => state.accounts) || [];
	const operations = useAccountingStore((state) => state.operations) || [];

	const [operationType, setOperationType] = useState<OperationType>('aktywna');
	const {
		notificationOpen,
		notificationMessage,
		status,
		showNotification,
		handleCloseNotification,
	} = useNotification();

	const validateOperation = (operation: Operation) => {
		if (operation.fromSide === operation.toSide) {
			return 'Operacja nie może być zaksięgowana na dwóch kontach po tej samej stronie';
		}

		if (operation.fromAccount === operation.toAccount) {
			return 'Konto źródłowe i docelowe nie mogą być takie same';
		}

		if (
			Number(operation.operationNumber) <= 0 ||
			operations.some((op) => op.operationNumber === operation.operationNumber)
		) {
			return 'Numer operacji musi być większy od 0 i być unikalny.';
		}

		const fromAccount = accounts.find((account) => account.name === operation.fromAccount);
		if (
			fromAccount &&
			((operation.fromSide === 'debit' && fromAccount.debit < operation.amount) ||
				(operation.fromSide === 'credit' && fromAccount.credit < operation.amount))
		) {
			return 'Konto źródłowe nie ma wystarczających środków';
		}

		return null;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(e.target as HTMLFormElement);
		const operation: Operation = {
			name: formData.get('operation-name') as string,
			date: formData.get('operation-date') as string,
			operationNumber: formData.get('operation-number') as unknown as number,
			amount: parseFloat(formData.get('amount') as string),
			type: formData.get('operation-type')?.toString().toLowerCase() as OperationType,
			fromAccount: formData.get('from-account') as string,
			fromSide: formData.get('from-side') === 'Debetowa' ? 'debit' : 'credit',
			toAccount: formData.get('to-account') as string,
			toSide: formData.get('to-side') === 'Debetowa' ? 'debit' : 'credit',
		};

		const errorMessage = validateOperation(operation);
		if (errorMessage) {
			showNotification(errorMessage, 'error');
			return;
		}

		addOperation(operation);
		updateAccounts(operation);
		showNotification('Operacja dodana pomyślnie', 'success');
		form.reset();
	};

	const getAccountOptions = (type: OperationType) => {
		switch (type.toLowerCase()) {
			case 'aktywna':
				return accounts.filter(
					(account) => account.name.includes('Umorzenie') || account.type === 'debit',
				);
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
			<Stack
				component="form"
				justifyContent="center"
				alignItems="center"
				spacing={4}
				px={4}
				onSubmit={handleSubmit}
			>
				<Grid container rowSpacing={4} columnSpacing={2}>
					<Grid item xs={12} sm={6} pt="0 !important" pl="9 !important">
						<TextField name="operation-name" label="Nazwa operacji" required fullWidth />
					</Grid>
					<Grid item xs={12} sm={6} pt="0 !important">
						<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
							<DateField name="operation-date" label="Data" fullWidth required />
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} sm={6} pl="9 !important">
						<TextField
							name="operation-number"
							label="Numer operacji"
							inputProps={{
								type: 'number',
								min: 1,
								max: 9999,
							}}
							required
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name="amount"
							label="Kwota"
							inputProps={{
								type: 'number',
								step: 1,
							}}
							required
							fullWidth
						/>
					</Grid>
				</Grid>
				<Autocomplete
					disablePortal
					id="operation-type"
					options={['Aktywna', 'Pasywna', 'Aktywno-pasywna']}
					onChange={(_e, value) => setOperationType(value as OperationType)}
					renderInput={(params) => (
						<TextField {...params} label="Typ operacji" name="operation-type" />
					)}
					fullWidth
				/>
				<Autocomplete
					disablePortal
					id="from-account"
					options={getAccountOptions(operationType).map((account) => account.name)}
					renderInput={(params) => <TextField {...params} label="Z konta" name="from-account" />}
					fullWidth
				/>
				<Autocomplete
					disablePortal
					id="from-side"
					options={['Debetowa', 'Kredytowa']}
					renderInput={(params) => <TextField {...params} label="Strona" name="from-side" />}
					fullWidth
				/>
				<Autocomplete
					disablePortal
					id="to-account"
					options={getAccountOptions(operationType).map((account) => account.name)}
					renderInput={(params) => <TextField {...params} label="Na konto" name="to-account" />}
					fullWidth
				/>
				<Autocomplete
					disablePortal
					id="to-side"
					options={['Debetowa', 'Kredytowa']}
					renderInput={(params) => <TextField {...params} label="Strona" name="to-side" />}
					fullWidth
				/>

				<SubmitButton>Dodaj operację</SubmitButton>
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
