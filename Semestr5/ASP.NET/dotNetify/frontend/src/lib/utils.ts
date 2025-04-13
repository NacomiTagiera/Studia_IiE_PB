import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function invariant(condition: boolean, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

export function assertNonNull<T>(value: T, message: string): asserts value is NonNullable<T> {
	if (value === null || value === undefined) throw new Error(message);
}

export const formatListeningTime = (seconds: number) => {
	if (seconds === 0) return '0 seconds';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const parts = [];

	if (hours > 0) {
		parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
	}
	if (minutes > 0) {
		parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
	}
	if (remainingSeconds > 0) {
		parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`);
	}

	return parts.join(' ');
};
