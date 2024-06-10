import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export const Footer = () => (
	<Box
		sx={{
			backgroundColor: 'gray.200',
			p: 6,
		}}
		component="footer"
	>
		<Container maxWidth="sm">
			<Typography variant="body2" color="text.secondary" align="center">
				{'Copyright © '}
				<Link color="inherit" href="https://github.com/NacomiTagiera">
					Rachunkowość Komputerowa
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
			</Typography>
		</Container>
	</Box>
);
