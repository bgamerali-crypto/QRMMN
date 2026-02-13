'use client';

import { useState, useTransition } from 'react';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';
import { ShieldCheck, User, Lock, ArrowRight, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [role, setRole] = useState<'professor' | 'student'>('student');
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setErrorMessage('');
        startTransition(async () => {
            const error = await authenticate(undefined, formData);
            if (error) {
                setErrorMessage(error);
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* ... background elements ... */}
            <div className="max-w-md w-full relative z-10 px-2 sm:px-0">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl shadow-black/50">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-lg shadow-blue-500/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            {role === 'professor' ? (
                                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            ) : (
                                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                            {role === 'professor' ? 'Professor Portal' : 'Student Portal'}
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg">Secure attendance management</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex p-1 bg-white/[0.05] rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Student
                        </button>
                        <button
                            onClick={() => setRole('professor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${role === 'professor' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Professor
                        </button>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <input type="hidden" name="role" value={role} />
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                                    placeholder={role === 'professor' ? "Enter your full name" : "Enter your student name"}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 text-white rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center animate-shake">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Authorizing...
                                </span>
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-400 mb-4">New to the platform?</p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300 transition-colors gap-1 group"
                        >
                            Create {role === 'professor' ? 'Professor' : 'Student'} Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-600 text-sm">
                    &copy; 2024 AttendancePro System. All rights reserved.
                </p>
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
}
