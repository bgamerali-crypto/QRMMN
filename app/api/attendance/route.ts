import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, studentName, universityId, deviceId, ipAddress } = body;

        if (!token || !studentName || !universityId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // validate session
        const { data: session, error: sessionError } = await supabase
            .from('ClassSession')
            .select('*')
            .eq('token', token)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: "Invalid session" }, { status: 404 });
        }

        if (!session.isActive) {
            return NextResponse.json({ error: "Session has ended" }, { status: 400 });
        }

        if (new Date() > new Date(session.expiresAt)) {
            return NextResponse.json({ error: "Session expired" }, { status: 400 });
        }

        // Anti-cheating: Check if student already registered for this session
        // Supabase allows structured queries
        const { data: existingRegistration } = await supabase
            .from('Attendance')
            .select('id')
            .eq('sessionId', session.id)
            .eq('universityId', universityId) // Unique constraint in DB should also catch this
            .maybeSingle();

        if (existingRegistration) {
            return NextResponse.json({ error: "You have already registered for this session" }, { status: 400 });
        }

        // Register
        const { data: attendance, error: insertError } = await supabase
            .from('Attendance')
            .insert({
                id: crypto.randomUUID(),
                studentName,
                universityId,
                deviceId: deviceId || "unknown",
                ipAddress: ipAddress || "unknown",
                sessionId: session.id,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Attendance insert error:", insertError);
            return NextResponse.json({ error: "Failed to register attendance" }, { status: 500 });
        }

        return NextResponse.json(attendance);
    } catch (error) {
        console.error("Attendance error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
