'use server';

import { signIn, signOut } from '@/auth';
import { supabase } from '@/lib/supabase';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log("authenticate action called with formData:", Object.fromEntries(formData));

        // Extract role to determine redirect path
        const role = formData.get('role') as string;
        const redirectTo = role === 'student' ? '/student/dashboard' : '/dashboard';

        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false, // We will handle redirect manually to be safe
        });

        // If signIn doesn't throw, we manually redirect
        redirect(redirectTo);

    } catch (error) {
        if ((error as any).message === 'NEXT_REDIRECT') {
            throw error;
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        // If it's a redirect error (though we set redirect:false above, just in case)
        throw error;
    }
}

export async function registerStudent(prevState: string | undefined, formData: FormData) {
    const name = (formData.get('name') as string)?.trim();
    const universityId = formData.get('universityId') as string;
    const extraCode = formData.get('extraCode') as string; // the 3 chars

    if (!name || !universityId || !extraCode) {
        return 'Missing required fields';
    }

    if (extraCode.length !== 3) {
        return 'Extra code must be exactly 3 characters';
    }

    // Password is ID + 3 chars as requested
    const password = universityId + extraCode;

    // Check if name already exists (since we login by name now)
    const { data: existingUser } = await supabase
        .from('User')
        .select('id')
        .eq('name', name)
        .maybeSingle();

    if (existingUser) {
        return 'A student with this name already exists';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
        .from('User')
        .insert({
            id: crypto.randomUUID(),
            name,
            universityId,
            password: hashedPassword,
            role: 'student',
            updatedAt: new Date().toISOString()
        });

    if (error) {
        console.error('Student registration error:', error);
        return 'Failed to create student account';
    }

    redirect('/login?registered=true');
}

export async function registerUser(prevState: string | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = (formData.get('name') as string)?.trim();

    if (!email || !password || !name) {
        return 'Missing required fields';
    }

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('User')
        .select('email')
        .eq('email', email)
        .single();

    if (existingUser) {
        return 'User already exists';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'Ahmed1.webdev@gmail.com' ? 'admin' : 'professor';

    const { error } = await supabase
        .from('User')
        .insert({
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            name,
            role,
            updatedAt: new Date().toISOString()
        });

    if (error) {
        console.error('Registration error details:', error);
        return `Failed to create user: ${error.message}`;
    }

    redirect('/login?registered=true');
}

export async function updateProfile(prevState: string | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const college = formData.get('college') as string;
    const department = formData.get('department') as string;

    if (!email || !college || !department) {
        return 'Missing fields';
    }

    const { error } = await supabase
        .from('User')
        .update({ college, department })
        .eq('email', email);

    if (error) {
        return 'Failed to update profile';
    }

    redirect('/dashboard');
}
export async function logout() {
    try {
        await signOut({ redirect: false });
    } catch (error) {
        // NextAuth v5 might throw a redirect, we catch it to handle it on the client
    }
}
