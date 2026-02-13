import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  const dashboardUrl = session
    ? ((session.user as any)?.role === 'student' ? "/student/dashboard" : "/dashboard")
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[80%] md:h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[80%] md:h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 text-center w-full max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-tight text-balance">
          Attendance<span className="text-blue-500">Pro</span>
        </h1>
        <p className="text-slate-400 mb-10 text-base md:text-xl max-w-lg mx-auto text-balance">
          The ultimate dynamic QR attendance system for students and professors.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <Link href={dashboardUrl!} className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2">
              Go to {(session.user as any)?.role === 'student' ? 'Student Portal' : 'Doctor Dashboard'}
            </Link>
          ) : (
            <>
              <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-center">
                Professor Login
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95 text-center">
                Student Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
