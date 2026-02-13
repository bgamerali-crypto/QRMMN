import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ name: z.string().min(2), password: z.string().min(6), role: z.string().optional() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const name = parsedCredentials.data.name.trim();
                    const { password, role } = parsedCredentials.data;
                    console.log(`[AUTH] Attempting login for: ${name} with role: ${role}`);

                    if (role === 'professor') {
                        const { data: professor } = await supabase
                            .from('User')
                            .select('*')
                            .eq('name', name)
                            .eq('role', 'professor')
                            .maybeSingle();

                        if (professor && professor.password) {
                            const passwordsMatch = await bcrypt.compare(password, professor.password);
                            if (passwordsMatch) return professor;
                        }
                    } else if (role === 'student') {
                        const { data: student } = await supabase
                            .from('User')
                            .select('*')
                            .eq('name', name)
                            .eq('role', 'student')
                            .maybeSingle();

                        if (student && student.password) {
                            const passwordsMatch = await bcrypt.compare(password, student.password);
                            if (passwordsMatch) return student;
                        }
                    } else {
                        // Fallback if no role specified (though our UI sends it)
                        const { data: user } = await supabase
                            .from('User')
                            .select('*')
                            .eq('name', name)
                            .maybeSingle();

                        if (user && user.password) {
                            const passwordsMatch = await bcrypt.compare(password, user.password);
                            if (passwordsMatch) return user;
                        }
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
                token.universityId = (user as any).universityId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                (session.user as any).role = token.role;
                (session.user as any).universityId = token.universityId;
            }
            return session;
        }
    }
});
