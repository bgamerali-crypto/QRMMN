'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { logout } from '@/app/lib/actions';
import {
    User, LogOut, CheckCircle, Clock, Users, QrCode,
    History, LayoutDashboard, Settings, Bell, Search,
    ArrowUpRight, Download, PlusSquare,
    ArrowRight, Menu, X, Info
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardClient({ user }: { user: any }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: classSession, mutate } = useSWR('/api/session', fetcher, {
        refreshInterval: 10000,
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed', err);
        }
        // Use browser's current origin to stay on the correct IP/domain
        window.location.href = window.location.origin + '/login';
    };

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

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
        { href: '/history', label: 'Attendance History', icon: History, active: false },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans relative overflow-x-hidden">
            {/* Sidebar Desktop */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                        <QrCode className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">QR<span className="text-blue-600">Attend</span></span>
                </div>

                <nav className="flex-1 p-6 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${link.active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 group'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${!link.active && 'group-hover:rotate-12 transition-transform'}`} />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <p className="text-sm text-slate-400 mb-1">Signed in as</p>
                        <p className="font-bold truncate mb-4">{user?.name || 'Professor'}</p>
                        <button
                            onClick={handleSignOut}
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-[280px] sm:w-80 bg-white z-[60] lg:hidden transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl">
                            <QrCode className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-black text-slate-800">QR<span className="text-blue-600">Attend</span></span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-4 space-y-1 flex-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${link.active ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${link.active ? 'text-blue-600' : ''}`} />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                            {user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate">{user?.name || 'Professor'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role || 'Academic'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4 sm:gap-8 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 lg:hidden text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm active:scale-95 transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Overview</h2>
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-xl transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                            {user?.name?.charAt(0) || 'P'}
                        </div>
                    </div>
                </header>


                <div className="p-4 sm:p-8">
                    {activeSession ? (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
                            {/* Left Column: QR & Status */}
                            <div className="xl:col-span-4 space-y-6 sm:space-y-8">
                                <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                                    <div className="bg-blue-600 h-1.5 absolute top-0 left-0 w-full"></div>
                                    <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-6 sm:mb-8">Active Session QR</h3>

                                    <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-inner border-2 border-slate-50 mb-6 sm:mb-8 inline-block w-full max-w-[280px]">
                                        {(() => {
                                            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ||
                                                (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                                            const qrValue = `${baseUrl}/register/${activeSession.token}`;
                                            return (
                                                <div className="aspect-square relative">
                                                    <QRCodeCanvas
                                                        value={qrValue}
                                                        size={256}
                                                        level="H"
                                                        includeMargin
                                                        className="rounded-2xl shadow-inner w-full h-full"
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="space-y-4">
                                        {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-left">
                                                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 font-medium">
                                                    <span className="font-black block mb-1">Localhost Warning</span>
                                                    You are using 'localhost'. Students won't be able to scan this QR. Please use your computer's IP address (e.g., http://192.168.x.x:3000) instead.
                                                </p>
                                            </div>
                                        )}
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Session Token</p>
                                            <p className="text-lg sm:text-xl font-mono text-blue-600 font-black break-all">{activeSession.token}</p>
                                        </div>
                                        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Expires {format(new Date(activeSession.expiresAt), 'h:mm a')}
                                        </p>
                                    </div>

                                    <button
                                        onClick={endSession}
                                        disabled={isLoading}
                                        className="mt-6 sm:mt-8 w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? 'Processing...' : 'End Session'}
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Live Data */}
                            <div className="xl:col-span-8 flex flex-col gap-6 sm:gap-8 overflow-hidden">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4">
                                        <div className="bg-blue-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-blue-600">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Present</p>
                                            <p className="text-xl sm:text-2xl font-black text-slate-800">{attendees.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4">
                                        <div className="bg-green-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-green-600">
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Verified</p>
                                            <p className="text-xl sm:text-2xl font-black text-slate-800">{attendees.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4 col-span-2 md:col-span-1">
                                        <div className="bg-purple-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-purple-600">
                                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                                            <p className="text-xl sm:text-2xl font-black text-slate-800">98%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 flex flex-col overflow-hidden">
                                    <div className="p-5 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Feed</h3>
                                        </div>
                                        <button className="flex items-center gap-2 text-[10px] sm:text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all">
                                            <Download className="w-4 h-4" />
                                            <span className="hidden xs:inline">Export</span>
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <div className="inline-block min-w-full align-middle">
                                            <div className="overflow-hidden">
                                                <table className="min-w-full text-left">
                                                    <thead className="bg-[#fcfdfe] border-b border-slate-50">
                                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <th className="px-5 sm:px-8 py-4 sm:py-5">Student</th>
                                                            <th className="hidden sm:table-cell px-8 py-5">ID</th>
                                                            <th className="px-5 sm:px-8 py-4 sm:py-5 text-right sm:text-left">Check-in</th>
                                                            <th className="hidden xs:table-cell px-5 sm:px-8 py-4 sm:py-5">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {attendees.map((student: any) => (
                                                            <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
                                                                <td className="px-5 sm:px-8 py-4 sm:py-5">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-all text-sm">
                                                                            {student.studentName.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-bold text-slate-800 text-sm sm:text-base block">{student.studentName}</span>
                                                                            <span className="sm:hidden text-[10px] text-slate-400">#{student.universityId}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="hidden sm:table-cell px-8 py-5 text-sm font-mono text-slate-500">
                                                                    #{student.universityId}
                                                                </td>
                                                                <td className="px-5 sm:px-8 py-4 sm:py-5 text-[11px] sm:text-sm text-slate-500 text-right sm:text-left">
                                                                    {format(new Date(student.timestamp), 'h:mm a')}
                                                                </td>
                                                                <td className="hidden xs:table-cell px-5 sm:px-8 py-4 sm:py-5">
                                                                    <span className="px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 text-[9px] sm:text-xs font-black rounded-full">OK</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {attendees.length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="px-8 py-16 sm:py-24 text-center">
                                                                    <div className="flex flex-col items-center justify-center opacity-20">
                                                                        <Users className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                                                                        <p className="text-base sm:text-lg font-black italic">Waiting for data...</p>
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
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto py-12 sm:py-24">
                            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="bg-blue-50 w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-8 sm:mb-10 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-inner">
                                    <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4 tracking-tighter">Ready to Begin?</h3>
                                <p className="text-slate-500 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed px-2 sm:px-4">
                                    Launch a new dynamic session. A custom QR code will be generated instantly for your students.
                                </p>
                                <button
                                    onClick={startSession}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 sm:py-5 px-6 sm:px-8 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-base sm:text-lg"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            Initializing...
                                        </span>
                                    ) : (
                                        <>
                                            Start Session
                                            <PlusSquare className="w-5 h-5 sm:w-6 sm:h-6" />
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

