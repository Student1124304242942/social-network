import { NextResponse, NextRequest } from "next/server";
import { Api } from "@/firebase";
const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return false;

    try {
        const user = await Api.getProfileInfo(token);
        console.log('ffdfs');
        return Boolean(user);
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        return false;
    }
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const protectedPaths = ['/post', '/profile', '/users', '/messages'];

    console.log('Запрашиваемый путь:', pathname);

    const userAuthenticated = await isAuthenticated(req);
    console.log('Авторизованный пользователь:', userAuthenticated);

    if (!userAuthenticated && protectedPaths.includes(pathname)) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        console.log('Перенаправление на /login:', url);
        return NextResponse.redirect(url);
    }

    if (!userAuthenticated && pathname === '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        console.log('Перенаправление на /login с главной:', url);
        return NextResponse.redirect(url);
    }

    if (userAuthenticated && pathname === '/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/profile';  
        console.log('Перенаправление на /profile:', url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

