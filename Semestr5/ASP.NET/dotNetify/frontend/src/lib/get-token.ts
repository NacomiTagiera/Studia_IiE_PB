import { cookies } from 'next/headers';

export const getToken = async () => (await cookies()).get(process.env.TOKEN_COOKIE_NAME as string);
