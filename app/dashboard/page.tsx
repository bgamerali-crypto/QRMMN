import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any)?.role;

    if (role === 'student') {
        redirect("/student/dashboard");
    }

    return <DashboardClient user={session.user} />;
}
