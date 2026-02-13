'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/app/components/QRScanner';
import { Loader2, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    // Gentle redirect if professor tries to access (optional)
    // if (session?.user?.role === 'professor') router.push('/dashboard');

    const handleScan = async (decodedText: string) => {
        setIsScanning(false);
        setScanStatus('loading');
        setMessage('Processing attendance...');

        try {
            // Extract token from URL if necessary
            let token = decodedText;
            if (token.includes('/register/')) {
                token = token.split('/register/').pop() || token;
            }

            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    studentName: session?.user?.name,
                    universityId: (session?.user as any).universityId || "UNKNOWN_ID",
                    deviceId: navigator.userAgent,
                    ipAddress: 'student-device'
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            setScanStatus('success');
            setMessage('Attendance Registered Successfully!');
        } catch (error: any) {
            setScanStatus('error');
            setMessage(error.message || 'Scanning failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="max-w-md mx-auto relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 tracking-tighter">
                            Student Portal
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">Logged in as {session?.user?.name}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                    >
                        <LogOut className="w-5 h-5 text-slate-300" />
                    </button>
                </header>

                <main className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Attendance Status</p>

                        {scanStatus === 'success' ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Check-in Success</h2>
                                    <p className="text-slate-400 text-sm">{message}</p>
                                </div>
                            </div>
                        ) : scanStatus === 'error' ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-24 h-24 bg-red-500/20 rounded-[2rem] flex items-center justify-center border border-red-500/20">
                                    <XCircle className="w-12 h-12 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Process Failed</h2>
                                    <p className="text-red-400/80 text-sm px-4">{message}</p>
                                </div>
                                <button
                                    onClick={() => setScanStatus('idle')}
                                    className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/10"
                                >
                                    Retry Scan
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-24 h-24 bg-blue-600/20 rounded-[2rem] flex items-center justify-center border border-blue-500/20 animate-pulse">
                                    <span className="text-4xl">✨</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Ready to Scan</h2>
                                    <p className="text-slate-400 text-sm max-w-[200px] mx-auto">Please point your camera at the doctor's QR code.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scanner Action */}
                    {scanStatus !== 'success' && (
                        <div className="relative">
                            {!isScanning ? (
                                <button
                                    onClick={() => {
                                        setScanStatus('idle');
                                        setIsScanning(true);
                                    }}
                                    className="w-full py-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all text-white flex items-center justify-center gap-3 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    <span className="relative z-10">Scan Doctor's QR</span>
                                </button>
                            ) : (
                                <div className="bg-[#020617] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative">
                                    <div className="absolute top-6 right-6 z-20">
                                        <button
                                            onClick={() => setIsScanning(false)}
                                            className="p-3 bg-red-500/20 backdrop-blur-md rounded-2xl text-red-400 hover:bg-red-500/30 transition-all border border-red-500/20"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-2 relative">
                                        <div className="absolute inset-0 border-[3px] border-blue-500/50 rounded-[2.8rem] pointer-events-none z-10 m-4 animate-pulse"></div>
                                        <QRScanner
                                            onScanSuccess={handleScan}
                                            onScanFailure={(err) => {
                                                setIsScanning(false);
                                                setScanStatus('error');
                                                const errorMessage = typeof err === 'string' ? err : (err as any).message || 'Camera Access Failed';

                                                if (errorMessage.includes('Only secure origins are allowed')) {
                                                    setMessage('Browser Security Block: Camera requires HTTPS to work on mobile. See implementation_plan.md for the fix.');
                                                } else {
                                                    setMessage(`Error: ${errorMessage}`);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="bg-slate-900/50 backdrop-blur-md py-4 text-center border-t border-white/5">
                                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                            Scanning Active...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <footer className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/[0.02] px-4 py-2 rounded-full border border-white/5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">System Securely Encrypted</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
