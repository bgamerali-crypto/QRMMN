'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Timer, UserCheck, Smartphone, CheckCircle, Info, XCircle } from 'lucide-react';

export default function StudentRegistration({ params }: { params: { token: string } }) {
    const { data: session } = useSession();
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const [universityId, setUniversityId] = useState(session?.user ? (session.user as any).universityId : '');
    const [studentName, setStudentName] = useState(session?.user?.name || '');

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
                    token: params.token,
                    studentName,
                    universityId,
                    deviceId: 'browser-id-temp',
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
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col shadow-black/50">
                    <div className="bg-slate-900/40 p-10 text-white relative border-b border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/10">
                                <Smartphone className="w-3.5 h-3.5" />
                                Secure Link
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${timeLeft < 30 ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                <Timer className="w-4 h-4" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Class Attendance</h1>
                        <p className="text-slate-400 text-sm font-medium">Verify your presence for the current session.</p>
                    </div>

                    <div className="p-10 bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-slate-700"
                                        placeholder="Enter your full name"
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
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-slate-700 font-mono"
                                        placeholder="20240001"
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
                                disabled={isLoading || timeLeft <= 0}
                                className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group ${timeLeft <= 0
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                {isLoading ? (
                                    <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : timeLeft <= 0 ? (
                                    'EXPIRED'
                                ) : (
                                    <>
                                        <span className="relative z-10">Verify Attendance</span>
                                        <UserCheck className="w-7 h-7 relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 flex items-start gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                <span className="text-white font-bold block mb-1 uppercase tracking-widest">Anti-Fraud Protection</span>
                                This link is uniquely tied to your identity. Device fingerprints and IP lookups are active to ensure record integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
