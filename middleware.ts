import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
	// Получаем токен из сессии NextAuth
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	});

	const url = request.nextUrl.clone();
	const isAuthPage = url.pathname.startsWith('/auth') || url.pathname === '/';
	const isProtectedPage = url.pathname.startsWith('/dashboard') || url.pathname === '/create-business';

	// Если это страница авторизации и есть куки - редирект на dashboard
	if (isAuthPage && token) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Если это защищенная страница и нет куки - редирект на авторизацию
	if (isProtectedPage && !token) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

// Указываем пути, для которых применяется middleware
export const config = {
	matcher: ['/', '/auth/:path*', '/dashboard/:path*', '/create-business']
}
