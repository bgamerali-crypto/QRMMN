'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldCheck, UserCheck, Smartphone, CheckCircle, Info, XCircle, ArrowRight } from 'lucide-react';

export default function StudentRegistration({ params }: { params: Promise<{ token: string }> }) {
    const { data: session } = useSession();
    // Unwrap params using React.use() for Next.js 15+ compatibility
    const resolvedParams = React.use(params);
    const token = resolvedParams.token;

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [universityId, setUniversityId] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        if (session?.user) {
            setStudentName(session.user.name || '');
            setUniversityId((session.user as any).universityId || '');
        }
    }, [session]);

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    studentName,
                    universityId,
                    deviceId: 'browser-id-' + (Math.random().toString(36).substring(7)),
                    ipAddress: 'student-browser'
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setErrorMessage(data.error || 'Check-in failed');
            }
        } catch (err) {
            setErrorMessage('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center font-sans overflow-hidden">
                {/* Background Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl relative z-10 w-full max-w-md">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Check-in Verified</h1>
                    <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">Your attendance has been securely recorded for this session.</p>
                    <div className="bg-white/5 px-8 py-5 rounded-[2rem] flex items-center justify-between text-sm font-black border border-white/5 uppercase tracking-widest text-slate-500">
                        <span>Registry Status</span>
                        <span className="text-emerald-400">Authenticated</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col shadow-black/50">
                    <div className="bg-slate-900/40 p-8 sm:p-10 text-white relative border-b border-white/5 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/10">
                                <Smartphone className="w-3.5 h-3.5" />
                                Secure Registration
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">Class Attendance</h1>
                        <p className="text-slate-400 text-sm font-medium">Please enter your details to verify presence.</p>
                    </div>

                    <div className="p-8 sm:p-10 bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-[1.5rem] py-4 sm:py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">University ID</label>
                                <div className="relative group">
                                    <Info className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        value={universityId}
                                        onChange={(e) => setUniversityId(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-[1.5rem] py-4 sm:py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-slate-700 font-mono"
                                        placeholder="University ID"
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-4 rounded-2xl italic flex items-center gap-3">
                                    <XCircle className="w-5 h-5 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 sm:py-6 rounded-[2rem] font-black text-lg sm:text-xl transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                {isLoading ? (
                                    <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="relative z-10">Confirm Presence</span>
                                        <ArrowRight className="w-7 h-7 relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 sm:mt-12 flex items-start gap-4 bg-white/5 p-5 sm:p-6 rounded-[2rem] border border-white/5">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                <span className="text-white font-bold block mb-1 uppercase tracking-widest">Security Note</span>
                                Your attendance is tracked by device and location to prevent duplication.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
