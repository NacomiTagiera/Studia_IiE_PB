import { Typography, TypographyProps } from '@mui/material';

export const Header = ({ children, ...rest }: TypographyProps) => (
	<Typography variant="h3" component="h2" gutterBottom align="center" {...rest}>
		{children}
	</Typography>
);
