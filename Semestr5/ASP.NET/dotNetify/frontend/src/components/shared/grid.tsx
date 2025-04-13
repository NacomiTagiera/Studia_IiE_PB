interface Props {
	children: React.ReactNode;
	as?: React.ElementType;
}

export const Grid = ({ children, as: Component = 'div' }: Props) => {
	return (
		<Component className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
			{children}
		</Component>
	);
};
