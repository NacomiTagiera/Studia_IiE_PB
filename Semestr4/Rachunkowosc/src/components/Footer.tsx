import { Box, Container, Link, Typography } from '@mui/material';

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
				<Link color="inherit" href="https://github.com/NacomiTagiera" target="_blank">
					Rachunkowość Komputerowa
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
			</Typography>
		</Container>
	</Box>
);
