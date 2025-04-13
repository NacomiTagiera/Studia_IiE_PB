import { useId } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Props {
	title: string;
	showAllHref?: string;
	showAllLabel?: string;
	children: React.ReactNode;
}

export const ScrollSection = ({ title, showAllHref, showAllLabel = 'Show all', children }: Props) => {
	const id = useId();

	return (
		<section aria-labelledby={id} className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 id={id} className="text-2xl font-bold">
					{title}
				</h2>
				{showAllHref && (
					<Button href={showAllHref} variant="link" className="text-neutral-400 hover:text-white">
						{showAllLabel}
					</Button>
				)}
			</div>
			<ScrollArea>
				<ul className="flex space-x-4 pb-4">{children}</ul>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</section>
	);
};
