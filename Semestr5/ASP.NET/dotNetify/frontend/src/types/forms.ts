export interface FormState {
	status: 'idle' | 'success' | 'error';
	message: string;
	issues?: Record<string, string[]>;
}
