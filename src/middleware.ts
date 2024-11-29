import { NextResponse, NextRequest } from "next/server";
import auth from "./firebase";

// Предполагается, что auth.currentUser вернет текущего аутентифицированного пользователя
const isAuthenticated = (): boolean => {
    return auth.currentUser !== null; // Предполагаем, что auth.currentUser возвращает текущего пользователя
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const protectedPaths = ['/post', '/profile', '/users', '/messages'];
    const userAuthenticated = isAuthenticated();

    // Если пользователь не аутентифицирован и пытается зайти на защищенные страницы
    if (!userAuthenticated && protectedPaths.includes(pathname)) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Если пользователь на главной странице и не аутентифицирован
    if (!userAuthenticated && pathname === '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        console.log('Redirecting to /login from root path');
        return NextResponse.redirect(url);
    }

    // Если пользователь аутентифицирован и пытается зайти на страницу входа
    if (userAuthenticated && pathname === '/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/profile';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/post/:path*', '/profile/:path*', '/users/:path*', '/messages/:path*'],
};
