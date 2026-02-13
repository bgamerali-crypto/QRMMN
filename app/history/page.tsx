'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { format } from 'date-fns';
import { Calendar, Users, ChevronRight, ChevronDown, ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HistoryPage() {
    const { data: sessions, error } = useSWR('/api/history', fetcher);
    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    if (error) return <div className="p-8 text-red-500 text-center font-bold">Failed to load history</div>;
    if (!sessions) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium tracking-wide">Retrieving your records...</p>
            </div>
        </div>
    );

    const historyData = Array.isArray(sessions) ? sessions : [];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all font-bold group mb-3">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Attendance Logs</h1>
                        <p className="text-slate-500 mt-1 font-medium">Review past sessions and student check-ins</p>
                    </div>
                </header>

                <div className="space-y-6">
                    {historyData.map((session: any) => (
                        <div key={session.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                                className="w-full text-left p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-xl text-slate-800">
                                            {format(new Date(session.createdAt), 'EEEE, MMMM do')}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                                {format(new Date(session.createdAt), 'h:mm a')}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                                                <Users className="w-4 h-4" />
                                                {session.attendees.length} Attendees
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {expandedSession === session.id ? (
                                        <ChevronDown className="w-6 h-6 rotate-180 transition-transform" />
                                    ) : (
                                        <ChevronRight className="w-6 h-6" />
                                    )}
                                </div>
                            </button>

                            {expandedSession === session.id && (
                                <div className="px-8 pb-8 pt-2 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
                                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Attendee Roster</h4>
                                        {session.attendees.length > 0 ? (
                                            <div className="space-y-2">
                                                {session.attendees.map((attendee: any) => (
                                                    <div key={attendee.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                                                <UserCircle className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-800 flex items-center gap-2">
                                                                    {attendee.studentName}
                                                                    {attendee.studentName === "علي الدين عبد المحسن احمد" && (
                                                                        <span title="Special Student">⭐</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-mono tracking-tighter">ID: #{attendee.universityId}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-slate-800 tracking-tighter">
                                                                {format(new Date(attendee.timestamp), 'h:mm:ss a')}
                                                            </p>
                                                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5 leading-none">Verified ✓</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 opacity-30 italic font-medium text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                                No check-ins recorded for this session.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {historyData.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No past sessions found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
