'use client';

import { useState, useEffect } from 'react';
import { updateProfile } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { School, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const college = formData.get('college') as string;
        const department = formData.get('department') as string;

        localStorage.setItem('college', college);
        localStorage.setItem('department', department);

        if (session?.user?.email) {
            formData.append('email', session.user.email);
            await updateProfile(undefined, formData);
        }

        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen text-black bg-[#f8fbff] flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Soft decorative circles */}
            <div className="absolute top-24 left-32 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-24 right-32 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="max-w-2xl w-full flex flex-col items-center">
                {/* Progress Indicators */}
                <div className="flex items-center gap-4 mb-16 relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 ${step === 1 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-blue-100 text-blue-600'}`}>
                        <Landmark className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-0.5 bg-blue-100 rounded-full"></div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 ${step === 2 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-300'}`}>
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-blue-50 w-full relative group">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Academic Identity</h1>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
                            Setup your institutional details to start tracking class attendance.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest pl-1">
                                    <School className="w-4 h-4 text-blue-500" />
                                    College / Faculty
                                </label>
                                <input
                                    name="college"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 font-semibold"
                                    placeholder="e.g. Faculty of Engineering"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest pl-1">
                                    <Landmark className="w-4 h-4 text-purple-500" />
                                    Department
                                </label>
                                <input
                                    name="department"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-300 font-semibold"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-3xl shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg group"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Finalizing...
                                    </span>
                                ) : (
                                    <>
                                        Complete Profile Setup
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-12 text-slate-400 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Your data is secure and will never be shared.
                </p>
            </div>
        </div>
    );
}
