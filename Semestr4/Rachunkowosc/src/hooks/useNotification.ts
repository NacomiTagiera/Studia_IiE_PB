import { useState } from 'react';

import { NotificationType } from '@/types';

export const useNotification = () => {
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [status, setStatus] = useState<NotificationType>('success');

	const showNotification = (message: string, status: NotificationType) => {
		setNotificationMessage(message);
		setStatus(status);
		setNotificationOpen(true);
	};

	const handleCloseNotification = (_e: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotificationOpen(false);
	};

	return {
		notificationOpen,
		notificationMessage,
		status,
		showNotification,
		handleCloseNotification,
	};
};
