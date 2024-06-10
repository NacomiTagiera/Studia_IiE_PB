import { Button, ButtonProps } from '@mui/material';

export const SubmitButton = ({ children, ...rest }: ButtonProps) => (
	<Button type="submit" variant="contained" {...rest}>
		{children}
	</Button>
);
