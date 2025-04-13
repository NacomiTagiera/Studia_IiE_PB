interface PlaylistCoverProps {
	title: string;
	className?: string;
}

export const PlaylistCover = ({ title, className }: PlaylistCoverProps) => {
	return (
		<div
			className={`flex size-full items-center justify-center rounded-md bg-brand font-semibold text-white ${className}`}
			title={title}
		>
			{title.charAt(0).toUpperCase()}
		</div>
	);
};
