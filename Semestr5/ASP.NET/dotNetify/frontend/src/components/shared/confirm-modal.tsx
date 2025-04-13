'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
	children: React.ReactNode;
	title: string;
	description: string;
	cancelBtn: string;
	confirmBtn: string;
	onConfirm: () => void;
}

export const ConfirmModal = ({ children, title, description, cancelBtn, confirmBtn, onConfirm }: Props) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>{description}</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelBtn}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>{confirmBtn}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
