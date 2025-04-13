import { Search } from 'lucide-react';

import Form from 'next/form';

import { Input } from '@/components/ui/input';

export const SearchBar = () => {
	return (
		<Form action="/search" className="relative flex max-w-[364px] flex-1 items-center">
			<Search className="absolute left-3 size-4 text-neutral-400" aria-hidden="true" />
			<Input
				id="query"
				name="query"
				aria-label="Search for a song, playlist or artist"
				type="search"
				placeholder="What do you want to listen to?"
				minLength={3}
				className="size-full rounded-full bg-slate-800/50 pl-10"
			/>
		</Form>
	);
};
