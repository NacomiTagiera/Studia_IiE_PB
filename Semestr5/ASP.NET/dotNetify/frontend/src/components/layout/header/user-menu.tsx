import { RiAdminLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenuContent, DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logout } from '@/features/auth/actions';
import { getCurrentUser } from '@/features/users/data-access';
import avatar from '@/public/avatar.webp';

import { UserMenuItem } from './user-menu-item';

export const UserMenu = async () => {
	const user = await getCurrentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={avatar.src} alt="User avatar" width={30} height={30} className="rounded-full" />
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-black">
				<DropdownMenuLabel className="text-center text-sm text-white">{user?.email}</DropdownMenuLabel>
				{user?.role === 'admin' && (
					<UserMenuItem icon={RiAdminLine} href="/admin">
						Admin panel
					</UserMenuItem>
				)}
				<UserMenuItem icon={RiLogoutBoxRLine} onClick={logout} className="text-red-400 hover:!text-red-500">
					Sign out
				</UserMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
