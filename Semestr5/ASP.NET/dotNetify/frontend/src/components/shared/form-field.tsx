import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export const FormField = ({ label, error, name, className, ...props }: Props) => {
	return (
		<div className="grid gap-2">
			<Label htmlFor={name}>{label}</Label>
			<Input
				{...props}
				className={cn('bg-slate-800/50', error && 'border-red-500 focus-visible:ring-red-500', className)}
				id={name}
				aria-describedby={`${name}-error`}
				aria-invalid={!!error}
			/>
			{error && (
				<p className="text-center text-sm text-red-500" id={`${name}-error`}>
					{error}
				</p>
			)}
		</div>
	);
};
