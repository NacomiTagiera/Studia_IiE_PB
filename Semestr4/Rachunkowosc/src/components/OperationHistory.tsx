'use client';

import { TableCell, TableRow } from '@mui/material';

import { useAccountingStore } from '@/store/useAccountingStore';

export const OperationHistory = () => {
	const operations = useAccountingStore((state) => state.operations);

	return (
		<>
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
		</>
	);
};
