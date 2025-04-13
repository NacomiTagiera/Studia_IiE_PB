import { connection } from 'next/server';

export const Copyright = async () => {
	await connection();

	return (
		<p className="mt-10 text-center text-sm/6 text-neutral-400">
			&copy; {new Date().getFullYear()} .NETify, Inc. All rights reserved.
		</p>
	);
};
