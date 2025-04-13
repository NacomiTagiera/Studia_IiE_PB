export interface User {
	id: string;
	email: string;
	username: string;
	role?: UserRole;
	avatar?: string;
}

export type UserRole = 'admin' | 'user';
