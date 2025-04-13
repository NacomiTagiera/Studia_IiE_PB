import { z } from 'zod';

export const authSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.trim()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(/[!@#$%^&*]/, 'Password must contain at least one special character')
});
