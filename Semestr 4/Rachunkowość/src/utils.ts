export const saveToLocalStorage = (key: string, value: unknown) => {
	if (typeof window === 'undefined') return null;

	localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (key: string) => {
	if (typeof window === 'undefined') return null;

	const storedValue = localStorage.getItem(key);
	return storedValue ? JSON.parse(storedValue) : null;
};

export const slugify = (text: string) =>
	text
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '');
