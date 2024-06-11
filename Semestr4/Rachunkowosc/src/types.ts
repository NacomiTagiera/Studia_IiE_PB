export type OperationType = 'aktywna' | 'pasywna' | 'aktywno-pasywna' | 'initial-balance';

export type AccountType = 'credit' | 'debit';

export interface Account {
	name: string;
	credit: number;
	debit: number;
	type: AccountType;
}

export interface Operation {
	name: string;
	date: string;
	operationNumber: number | 'Sp';
	amount: number;
	type: OperationType;
	fromAccount: string;
	toAccount: string;
	fromSide: AccountType;
	toSide: AccountType;
}

export type NotificationType = 'success' | 'error';
