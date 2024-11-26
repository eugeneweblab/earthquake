import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = ['/login/'];

const authPaths = ['/login/'];

/**
 * Checks if the given path is a public path
 * @param {string} pathname - The current path
 * @returns {boolean} True if the path is public, false otherwise
 */
function isPublicPath(pathname: string): boolean {
	return publicPaths.includes(pathname);
}

/**
 * Checks if the given path is an authentication-related path
 * @param {string} pathname - The current path
 * @returns {boolean} True if the path is related to authentication, false otherwise
 */
function isAuthPath(pathname: string): boolean {
	return authPaths.includes(pathname);
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const cookieStore = await cookies();
	const token = cookieStore.get('earthquakeToken');

	// Redirect to /login/ if the user is not authenticated and the path is not public
	if (!token && !isPublicPath(pathname)) {
		return NextResponse.redirect(new URL('/login/', request.nextUrl));
	}

	// Redirect to / if the user is authenticated but tries to access an auth path (e.g., /login/)
	if (token && isAuthPath(pathname)) {
		return NextResponse.redirect(new URL('/', request.nextUrl));
	}

	if (!token && isPublicPath(pathname)) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	// Matcher for paths that exclude API, Next.js static paths, and image files
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
