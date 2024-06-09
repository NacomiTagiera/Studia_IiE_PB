import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

interface Props {
	open: boolean;
	message: string;
	onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
}

const SlideTransition = (props: SlideProps) => {
	return <Slide {...props} direction="up" />;
};

export const Notification = ({ open, message, onClose }: Props) => (
	<Snackbar
		open={open}
		message={message}
		autoHideDuration={5000}
		TransitionComponent={SlideTransition}
		onClose={onClose}
	>
		<Alert variant="filled" severity="success" sx={{ width: '100%' }} onClose={onClose}>
			{message}
		</Alert>
	</Snackbar>
);
