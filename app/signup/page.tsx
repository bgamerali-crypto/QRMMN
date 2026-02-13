'use client'
import { useState, useActionState } from 'react';
import { registerUser, registerStudent } from '@/app/lib/actions';
import { Loader2, User, Mail, Lock, GraduationCap, Briefcase, Hash } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    const [role, setRole] = useState<'professor' | 'student'>('student');
    const [professorError, professorDispatch] = useActionState(registerUser, undefined);
    const [studentError, studentDispatch] = useActionState(registerStudent, undefined);

    const errorMessage = role === 'professor' ? professorError : studentError;
    const dispatch = role === 'professor' ? professorDispatch : studentDispatch;

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-400">Choose your role to get started</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex p-1 bg-white/[0.05] rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => setRole('professor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${role === 'professor' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Professor
                        </button>
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Student
                        </button>
                    </div>

                    <form action={dispatch} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {role === 'professor' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="name@university.edu"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">University ID</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="universityId"
                                            type="text"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="2024xxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Secret Code (3 chars)</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            name="extraCode"
                                            type="text"
                                            required
                                            maxLength={3}
                                            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="ABC"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic ml-2">
                                        Your password will be: UniversityID + SecretCode
                                    </p>
                                </div>
                            </>
                        )}

                        {errorMessage && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Create {role === 'professor' ? 'Professor' : 'Student'} Account
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <span className="text-slate-400">Already have an account? </span>
                        <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
