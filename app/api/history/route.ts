import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get User ID
    const { data: user } = await supabase
        .from('User')
        .select('id')
        .eq('email', session.user.email)
        .single();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const { data: history, error } = await supabase
            .from('ClassSession')
            .select(`
                *,
                attendees:Attendance(*)
            `)
            .eq('professorId', user.id)
            .eq('isActive', false)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return NextResponse.json(history);
    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
