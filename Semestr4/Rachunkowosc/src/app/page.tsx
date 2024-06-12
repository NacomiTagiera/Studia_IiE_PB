import NextLink from 'next/link';
import { Button, Stack } from '@mui/material';

import { AccountList } from '@/components/AccountList';
import { Header } from '@/components/Header';

export default function Home() {
	return (
		<>
			<Stack
				component="header"
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				marginBlockEnd={4}
			>
				<Header pb={0} mb={0}>Lista kont</Header>
				<NextLink href="/salda-poczatkowe" passHref>
					<Button variant="contained" size="large">
						Salda początkowe
					</Button>
				</NextLink>
			</Stack>
			<AccountList />
		</>
	);
}
