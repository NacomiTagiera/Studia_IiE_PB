import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
	return (
		<>
			<CardHeader>
				<CardTitle className="text-center text-xl">Welcome back</CardTitle>
				<CardDescription className="text-center">Login with your email and password</CardDescription>
			</CardHeader>
			<CardContent className="sm:max-w-md">
				<LoginForm />
			</CardContent>
		</>
	);
}
