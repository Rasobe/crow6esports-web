import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import type { TryoutsFormData } from "@/features/tryouts/schema";
import { buildTryoutEmail } from "./tryout-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const data: TryoutsFormData = await request.json();

        await resend.emails.send({
            from: "noreply@crow6esports.com",
            to: "crow6esports@gmail.com",
            subject: `Tryout — ${data.discord}`,
            html: buildTryoutEmail(data),
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error enviando email:", error);
        return NextResponse.json({ error: "Error al enviar la solicitud" }, { status: 500 });
    }
}