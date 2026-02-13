import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    const role = (session.user as any)?.role;
    if (role === 'student') {
      redirect("/student/dashboard");
    }
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-5xl font-black mb-4 tracking-tighter">Attendance<span className="text-blue-500">Pro</span></h1>
      <p className="text-slate-400 mb-12 text-lg">The ultimate dynamic QR attendance system.</p>
      <Link href="/login" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
        Professor Login
      </Link>
    </main>
  );
}
