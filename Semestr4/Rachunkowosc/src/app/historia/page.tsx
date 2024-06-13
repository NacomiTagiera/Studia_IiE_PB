import { Header } from '@/components/Header';
import { OperationHistory } from '@/components/OperationHistory';
import { Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function HistoryPage() {
	return (
		<>
			<Header>Historia wszystkich operacji</Header>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Nazwa operacji
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Data
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Numer
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Kwota
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Z konta
								</TableCell>
								<TableCell align="center" sx={{ fontWeight: 600 }}>
									Na konto
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<OperationHistory />
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	);
}
