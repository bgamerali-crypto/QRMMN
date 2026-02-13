'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
    User, LogOut, CheckCircle, Clock, Users, QrCode,
    History, LayoutDashboard, Settings, Bell, Search,
    ArrowUpRight, Download, PlusSquare
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const router = useRouter();
    const { data: nextSession, status } = useSession();

    const { data: classSession, error, mutate } = useSWR('/api/session', fetcher, {
        refreshInterval: 5000,
    });

    useEffect(() => {
        if (status === 'authenticated') {
            if ((nextSession?.user as any)?.role === 'student') {
                router.push('/student/dashboard');
                return;
            }
            const college = localStorage.getItem('college');
            if (!college) {
                router.push('/onboarding');
            }
        }
    }, [status, router, nextSession]);

    const [isLoading, setIsLoading] = useState(false);

    const startSession = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/session', { method: 'POST' });
            mutate();
        } catch (err) {
            console.error('Failed to start session', err);
        } finally {
            setIsLoading(false);
        }
    };

    const endSession = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/session', { method: 'PATCH' });
            mutate();
        } catch (err) {
            console.error('Failed to end session', err);
        } finally {
            setIsLoading(false);
        }
    };

    const activeSession = classSession?.id && classSession?.isActive ? classSession : null;
    const attendees = activeSession?.attendees || [];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                        <QrCode className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">QR<span className="text-blue-600">Attend</span></span>
                </div>

                <nav className="flex-1 p-6 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 bg-blue-50 text-blue-700 rounded-2xl font-semibold transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/history" className="flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-medium transition-all group">
                        <History className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Attendance History
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-medium transition-all">
                        <Settings className="w-5 h-5" />
                        Profile Settings
                    </Link>
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <p className="text-sm text-slate-400 mb-1">Signed in as</p>
                        <p className="font-bold truncate mb-4">{nextSession?.user?.name || 'Professor'}</p>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-8 flex-1">
                        <h2 className="text-lg font-bold text-slate-800">Overview</h2>
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search sessions or students..."
                                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                            {nextSession?.user?.name?.charAt(0) || 'P'}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {activeSession ? (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            {/* Left Column: QR & Status */}
                            <div className="xl:col-span-4 space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                                    <div className="bg-blue-600 h-1.5 absolute top-0 left-0 w-full"></div>
                                    <h3 className="text-xl font-black text-slate-800 mb-8">Active Session QR</h3>

                                    <div className="bg-white p-5 rounded-3xl shadow-inner border-2 border-slate-50 mb-8 inline-block transform hover:scale-105 transition-transform duration-500">
                                        {(() => {
                                            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ||
                                                (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                                            const qrValue = `${baseUrl}/register/${activeSession.token}`;
                                            return (
                                                <QRCodeCanvas
                                                    value={qrValue}
                                                    size={256}
                                                    level="H"
                                                    includeMargin
                                                    className="rounded-2xl shadow-inner"
                                                />
                                            );
                                        })()}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Session Token</p>
                                            <p className="text-xl font-mono text-blue-600 font-black">{activeSession.token}</p>
                                        </div>
                                        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Expires at {format(new Date(activeSession.expiresAt), 'h:mm a')}
                                        </p>
                                    </div>

                                    <button
                                        onClick={endSession}
                                        disabled={isLoading}
                                        className="mt-8 w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? 'Processing...' : 'End Session Early'}
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-white/10 p-3 rounded-2xl">
                                            <PlusSquare className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-tighter italic">Recommended</span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">Need a substitute?</h4>
                                    <p className="text-sm text-slate-400 mb-6">Share this session access with another professor easily.</p>
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20">
                                        Share Session
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Live Data */}
                            <div className="xl:col-span-8 flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Present</p>
                                            <p className="text-2xl font-black text-slate-800">{attendees.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                        <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified</p>
                                            <p className="text-2xl font-black text-slate-800">{attendees.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                                            <p className="text-2xl font-black text-slate-800">98%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 flex flex-col overflow-hidden">
                                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Real-time Feed</h3>
                                        </div>
                                        <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                                            <Download className="w-4 h-4" />
                                            Export CSV
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto flex-1 h-[400px]">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#fcfdfe] sticky top-0 z-10 border-b border-slate-50">
                                                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="px-8 py-5">Student Information</th>
                                                    <th className="px-8 py-5">University ID</th>
                                                    <th className="px-8 py-5">Check-in</th>
                                                    <th className="px-8 py-5">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {attendees.map((student: any) => (
                                                    <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                                                    {student.studentName.charAt(0)}
                                                                </div>
                                                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                                                    {student.studentName}
                                                                    {student.studentName === 'علي الدين عبد المحسن احمد' && (
                                                                        <span title="Special Student">⭐</span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-mono text-slate-500">
                                                            #{student.universityId}
                                                        </td>
                                                        <td className="px-8 py-5 text-sm text-slate-500">
                                                            {format(new Date(student.timestamp), 'h:mm:ss a')}
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full">Success</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {attendees.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-8 py-24 text-center">
                                                            <div className="flex flex-col items-center justify-center opacity-20">
                                                                <Users className="w-16 h-16 mb-4" />
                                                                <p className="text-lg font-black italic">Waiting for incoming data...</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto py-24">
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="bg-blue-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-inner">
                                    <QrCode className="w-12 h-12 text-blue-600" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">Ready to Begin?</h3>
                                <p className="text-slate-500 mb-10 text-lg leading-relaxed px-4">
                                    Launch a new dynamic session. A custom QR code will be generated instantly for your students.
                                </p>
                                <button
                                    onClick={startSession}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            Initializing...
                                        </span>
                                    ) : (
                                        <>
                                            Start Attendance Round
                                            <PlusSquare className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
