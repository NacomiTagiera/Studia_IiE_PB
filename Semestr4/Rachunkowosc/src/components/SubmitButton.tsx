import { Button, ButtonProps } from '@mui/material';

export const SubmitButton = ({ children, ...rest }: ButtonProps) => (
	<Button type="submit" variant="contained" sx={{ maxWidth: 'max-content' }} {...rest}>
		{children}
	</Button>
);
