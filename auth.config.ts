import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        // Added later in auth.ts
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = (auth?.user as any)?.role;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnStudentDashboard = nextUrl.pathname.startsWith('/student/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) {
                    if (userRole === 'professor') return true;
                    if (userRole === 'student') return Response.redirect(new URL('/student/dashboard', nextUrl));
                    return false;
                }
                return false; // Redirect to login
            } else if (isOnStudentDashboard) {
                if (isLoggedIn) {
                    if (userRole === 'student') return true;
                    if (userRole === 'professor') return Response.redirect(new URL('/dashboard', nextUrl));
                    return false;
                }
                return false; // Redirect to login
            } else if (isLoggedIn) {
                // If logged in and on login/signup, redirect to respective dashboard
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup') {
                    if (userRole === 'student') return Response.redirect(new URL('/student/dashboard', nextUrl));
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
