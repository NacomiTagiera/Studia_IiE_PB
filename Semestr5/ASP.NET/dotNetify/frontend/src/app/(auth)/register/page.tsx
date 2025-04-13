import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistrationForm } from '@/features/auth/components/registration-form';

export default function SignUpPage() {
	return (
		<>
			<CardHeader>
				<CardTitle className="text-center text-xl">Create an account</CardTitle>
				<CardDescription className="text-center">Sign up with your email and password</CardDescription>
			</CardHeader>
			<CardContent className="sm:max-w-md">
				<RegistrationForm />
			</CardContent>
		</>
	);
}
