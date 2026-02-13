import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentDashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any)?.role;

    if (role === 'professor') {
        redirect("/dashboard");
    }

    return <StudentDashboardClient user={session.user} />;
}
