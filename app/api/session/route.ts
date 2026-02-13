import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Log for debugging (will show in terminal)
    process.stdout.write(`API POST /session: User=${session.user?.name}, Role=${userRole}, ID=${userId}\n`);

    if (userRole !== 'professor') {
        console.error(`FORBIDDEN: User ${session.user?.name} has role ${userRole}`);
        return NextResponse.json({ error: `Forbidden: Professors only. Your role is ${userRole}` }, { status: 403 });
    }

    // Generate a unique token
    const token = randomBytes(32).toString("hex");
    const expiresAt = addMinutes(new Date(), 10).toISOString();

    // Deactivate previous active sessions for this professor
    await supabase
        .from('ClassSession')
        .update({ isActive: false })
        .eq('professorId', userId)
        .eq('isActive', true);

    const { data: newSession, error } = await supabase
        .from('ClassSession')
        .insert({
            id: crypto.randomUUID(),
            token,
            professorId: userId,
            expiresAt,
            isActive: true,
            updatedAt: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error("Session creation error:", error);
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json(newSession);
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== 'professor') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: activeSession, error } = await supabase
        .from('ClassSession')
        .select(`
            *,
            attendees:Attendance(*)
        `)
        .eq('professorId', userId)
        .eq('isActive', true)
        .gt('expiresAt', new Date().toISOString())
        .maybeSingle();

    if (error) {
        console.error("Get session error:", error);
    }

    if (!activeSession) {
        return NextResponse.json(null);
    }

    return NextResponse.json(activeSession);
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    if (userRole !== 'professor') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // End all active sessions for this user
    await supabase
        .from('ClassSession')
        .update({ isActive: false })
        .eq('professorId', userId)
        .eq('isActive', true);

    return NextResponse.json({ success: true });
}
