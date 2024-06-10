import { create } from 'zustand';

import { Account, Operation } from '@/types';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils';

interface StoreState {
	accounts: Account[];
	operations: Operation[];
	addOperation: (operation: Operation) => void;
	updateAccounts: (operation: Operation) => void;
	setInitialBalance: (account: Omit<Account, 'type'>) => void;
}

export const useAccountingStore = create<StoreState>((set) => ({
	accounts: loadFromLocalStorage('accounts') || [
		{ name: 'Środki pieniężne w kasie', credit: 0, debit: 0, type: 'debit' },
		{ name: 'Środki pieniężne na r-kach bankowych', credit: 0, debit: 0, type: 'debit' },
		{ name: 'Środki transportu', credit: 0, debit: 0, type: 'debit' },
		{ name: 'Urządzenia techniczne i maszyny', credit: 0, debit: 0, type: 'debit' },
		{
			name: 'Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy',
			credit: 0,
			debit: 0,
			type: 'debit',
		},
		{ name: 'Umorzenie urządzeń technicznych i maszyn', credit: 0, debit: 0, type: 'credit' },
		{ name: 'Umorzenie środków transportu', credit: 0, debit: 0, type: 'credit' },
		{ name: 'Kapitał podstawowy', credit: 0, debit: 0, type: 'credit' },
		{
			name: 'Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy',
			credit: 0,
			debit: 0,
			type: 'credit',
		},
		{ name: 'Kredyty bankowe krótkoterminowe', credit: 0, debit: 0, type: 'credit' },
		{ name: 'Zobowiązania z tytułu wynagrodzeń', credit: 0, debit: 0, type: 'credit' },
		{ name: 'Zobowiązania z tytułów publicznoprawnych', credit: 0, debit: 0, type: 'credit' },
		{ name: 'Zysk (strata) netto', credit: 0, debit: 0, type: 'credit' },
	],
	operations: loadFromLocalStorage('operations') || [],
	addOperation: (operation) => {
		set((state) => {
			const newState = {
				...state,
				operations: [...state.operations, operation],
			};

			saveToLocalStorage('operations', newState.operations);
			return newState;
		});
	},
	updateAccounts: (operation) => {
		set((state) => {
			const fromAccount = state.accounts.find((account) => account.name === operation.fromAccount);
			const toAccount = state.accounts.find((account) => account.name === operation.toAccount);

			if (fromAccount && toAccount) {
				if (operation.fromSide === 'debit') {
					fromAccount.debit -= operation.amount;
				} else {
					fromAccount.credit -= operation.amount;
				}

				if (operation.toSide === 'debit') {
					toAccount.debit += operation.amount;
				} else {
					toAccount.credit += operation.amount;
				}
			}

			saveToLocalStorage('accounts', state.accounts);
			return state;
		});
	},
	setInitialBalance: ({ name, credit, debit }: Omit<Account, 'type'>) => {
		set((state) => {
			const account = state.accounts.find((account) => account.name === name);

			if (!account) {
				return state;
			}

			if (credit === 0 && debit === 0) {
				return state;
			}

			account.credit = credit;
			account.debit = debit;

			const newOperation: Operation = {
				name: 'Saldo początkowe',
				date: new Date().toISOString().split('T')[0] || '01.01.1900',
				number: 'Sp',
				amount: credit > 0 ? credit : debit,
				type: 'initial-balance',
				fromAccount: name,
				fromSide: credit > 0 ? 'credit' : 'debit',
				toAccount: name,
				toSide: credit > 0 ? 'credit' : 'debit',
			};

			const newState = {
				...state,
				operations: [...state.operations, newOperation],
			};

			saveToLocalStorage('operations', newState.operations);
			saveToLocalStorage('accounts', newState.accounts);

			return newState;
		});
	},
}));
